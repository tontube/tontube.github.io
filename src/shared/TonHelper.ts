import TonWeb from "tonweb";
export class TonHelper {
    private tonweb;
    private mySeed: any;
    public seed: any;
    public keyPair: any;
    public publicKey: any;
    public walletAddress: any;
    public wallet: any;
    public serverPublicKey: any;
    public serverWalletAddr: any;
    public walletAddressString: any;

    constructor() {
        const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';
        const apiKey = 'eb6b642b1de62cfbdeabcb772d95ee2f8989ae4094be51e6fb99b62518e9ad5d';
        this.tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, {apiKey}));
        const sd = localStorage.getItem('ton_pk') as string;
        const newSeed = TonWeb.utils.hexToBytes(sd);

        this.keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(newSeed);
        this.publicKey = this.keyPair.publicKey;
        const secretKey = this.keyPair.secretKey;

        this.wallet = this.tonweb.wallet.create({ publicKey: this.publicKey });

        const init = async() => {
            this.walletAddress = await this.wallet.getAddress();
            this.walletAddressString = this.walletAddress.toString(true, true, true);
            // console.log(this.walletAddressString)
            try {
                // await this.wallet.deploy(secretKey).send();
            } catch {
                console.log('deploy once !')
            }
        }

        init();
    }

    sleep(time: any) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async getBalance() {
        if (!this.walletAddress) {
            this.walletAddress = await this.wallet.getAddress();

        }

        return await this.tonweb.getBalance(this.walletAddress);
    }

    async createChannel(amount: any) {
        const BN = TonWeb.utils.BN;
        const toNano = TonWeb.utils.toNano;


        const channelConfig = {
            channelId: Math.round(Math.random() * 100000),
            addressA: this.walletAddress,
            addressB: this.serverWalletAddr,
            initBalanceA: toNano(String(amount)),
            initBalanceB: toNano('0')
        }

        const channel = this.tonweb.payments.createChannel({
            ...channelConfig,
            isA: true,
            myKeyPair: this.keyPair,
            hisPublicKey: this.serverPublicKey,
        });
        const channelAddress = await channel.getAddress();

        const fromWallet = channel.fromWallet({
            wallet: this.wallet,
            secretKey: this.keyPair.secretKey
        });
        await fromWallet.deploy().send(toNano('0.05'));

        await this.sleep(5000);

        await fromWallet
            .topUp({coinsA: channelConfig.initBalanceA, coinsB: new BN(0)})
            .send(channelConfig.initBalanceA.add(toNano('0.05'))); // +0.05 TON to network fees

        await this.sleep(5000);

        let state = {
            balanceA: channelConfig.initBalanceA,
            balanceB: toNano('0'),
            seqnoA: new BN(0),
            seqnoB: new BN(0)
        };

        await fromWallet.init(state).send(toNano('0.01'));

        await this.sleep(5000);

        return {
            channel_id: channelConfig.channelId,
            channel_address: channelAddress.toString(true, true, true),
            client_wallet_address: this.walletAddress.toString(true, true, true),
            client_public_key: this.publicKey,
            client_balance: amount,
            server_balance: 0,
            client_sequence_number: 0,
            client_signature: null
        }
    }

    async pay(state: any) {
        const BN = TonWeb.utils.BN;
        const toNano = TonWeb.utils.toNano;

        let newClientBalance = parseInt(parseFloat(state.client_balance) * 10000) - 100;
        let newServerBalance = parseInt(parseFloat(state.server_balance) * 10000) + 100;
        let newSequenceNumber = state.client_sequence_number + 1;

        let newState = {
            balanceA: toNano(String(newClientBalance / 10000)),
            balanceB: toNano(String(newServerBalance / 10000)),
            seqnoA: new BN(newSequenceNumber),
            seqnoB: new BN(0)
        }

        const channelConfig = {
            channelId: state.channel_id,
            addressA: this.walletAddress,
            addressB: this.serverWalletAddr,
            initBalanceA: toNano(String((newClientBalance + newServerBalance) / 10000)),
            initBalanceB: toNano('0')
        }

        const channel = this.tonweb.payments.createChannel({
            ...channelConfig,
            isA: true,
            myKeyPair: this.keyPair,
            hisPublicKey: this.serverPublicKey,
        });
        const channelAddress = await channel.getAddress();

        console.log('Processed payment. New balance is ' + newClientBalance);

        let signature;
        if (newClientBalance == 0) {
            signature = await channel.signClose(newState);
        }
        else {
            signature = await channel.signState(newState);
        }

        return {
            channel_id: channelConfig.channelId,
            channel_address: channelAddress.toString(true, true, true),
            client_wallet_address: this.walletAddress.toString(true, true, true),
            client_public_key: this.publicKey,
            client_balance: newClientBalance / 10000,
            server_balance: newServerBalance / 10000,
            client_sequence_number: newSequenceNumber,
            client_signature: signature
        }
    }

    async createSeed () {
        const seed = await TonWeb.utils.bytesToHex(this.tonweb.utils.newSeed())
        localStorage.setItem('ton_pk', seed)
    }
}

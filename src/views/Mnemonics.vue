<template>
  <div class="container mt-10">
    <Card>
      <template #title>
        Here Is You Wallet Address
      </template>
      <template #content>
        <p class="help-note">In order to continue please balance you walelt</p>
        <div class="input-container">
          <span>
            {{walletAddr}}
          </span>
        </div>
      </template>
      <template #footer>
        <Button icon="pi pi-check" @click="goToStream" label="Go To Stream page" />
      </template>
    </Card>
  </div>

</template>
<script setup lang="ts">
import TonWeb from "tonweb";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const walletAddr = ref('');
const vis = ref(true);

const router = useRouter();
onMounted(async () => {
  if (localStorage.hasOwnProperty('ton_pk')) {
    router.push('/home')
  } else {
    const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
    const apiKey = 'eb6b642b1de62cfbdeabcb772d95ee2f8989ae4094be51e6fb99b62518e9ad5d'; // Obtain your API key in https://t.me/tontestnetapibot
    const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, {apiKey}));

    const seed = TonWeb.utils.bytesToHex(tonweb.utils.newSeed())
    localStorage.setItem('ton_pk', seed)

    const newSeed = TonWeb.utils.hexToBytes(seed);
    const keyPair = tonweb.utils.nacl.sign.keyPair.fromSeed(newSeed);

    const publicKey = keyPair.publicKey;
    const secretKey =  keyPair.secretKey;

    const wallet = tonweb.wallet.create({  publicKey });

    const walletAddress = await wallet.getAddress();
    const walletAddressString = walletAddress.toString(true, true, true);
    walletAddr.value = walletAddress.toString(true, true, true);
    console.log(walletAddressString)
  }
})
const goToStream = () => {
  router.push('/home');
}
</script>
<style lang="css">
.input-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.help-note {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}
</style>

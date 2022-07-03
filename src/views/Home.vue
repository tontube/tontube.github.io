<template>
  <div class="h-full">
    <div class="bg-blue-650 h-12 w-full">
      <div class="flex flex-row w-100 justify-around app-ton-header">
        <span class="text-white font-bold ton-tube">Ton Tube</span>
        <div class="ton-ac-tim">
          <div class="flex flex-row items-center justify-between">
            <i class="pi pi-clock mr-2"></i>
            <span>TIME: {{timeBalance}}</span>
          </div>
          <div class="flex flex-row items-center justify-between">
            <i class="pi pi-dollar mr-2"></i>
            <span>TON {{ tonBalance }}</span>
          </div>

        </div>
      </div>
    </div>


    <div class="player-container relative vid-container">
      <video class="v-pl" poster="/logo_big.jpg" @ended="streamEnded" ref="videoPlayer" src=""></video>
      <div class="v-b-hl">
        <Button class="btn-play-stream" @click="playStream">Play Stream</Button>
      </div>
      <!-- ================ Buy Subscription Dialog ==============     -->
      <Dialog v-model:visible="balanceAcc">
        <template #header>
          <h3 class="block w-full">Buy Subscription</h3>
        </template>
        <p class="mb-3">
          Each TON is equal to 100 hours of stream time. Enjoy!
        </p>
        <InputText
            v-model="amount"
            placeholder="value in TON"
        >
        </InputText>

        <template #footer>
          <Button  label="Cancel" @click="balanceAcc = false" icon="pi pi-times" class="p-button-text"/>
          <Button :loading="isLoading" @click="createChannel" label="Ok" icon="pi pi-check" autofocus />
        </template>
      </Dialog>
    <!-- ================ End Subscription Dialog ==============-->
      <Dialog v-model:visible="subEnded">
        <template #header>
          <h3 class="block w-full">Subscription Ended</h3>
        </template>
        <p class="mb-3">
          Your subscription has ended! If you want to continue watching, please press 'play' and make another purchase.
        </p>
        <InputText
            v-model="amount"
            placeholder="value in TON"
        >
        </InputText>

        <template #footer>
          <Button  label="ok" @click="subEnded = false" icon="pi pi-times" class="p-button-text"/>
        </template>
      </Dialog>
    </div>
  </div>

</template>

<script>
import {TonHelper} from "@/shared/TonHelper";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import TonWeb from "tonweb";

const OwnState = {
  "IDLE":"IDLE",
  "PREPARING":"PREPARING",
  "STREAMING":"STREAMING",
  "FINALIZING":"FINALIZING",
}
export default {
  name: 'Home',
  data () {
    return {
      source: '',
      serverPublicKey: '',
      serverWalletAddr: '',
      tonHelp: new TonHelper(),
      streamState: OwnState.IDLE,
      latestState: null,
      remaningTime: 5,
      balanceAcc: false,
      amount: 0.05,
      secret: '',
      tonBalance: 0,
      counter: 0,
      tnTimer: undefined,
      timeBalance: 'No subscription',
      showWalletAddr: false,
      isLoading: false,
      subEnded: false,
    }
  },
  sockets: {
    connect: function () {
      console.log('~~~~~~~~~~~socket connected~~~~~~~~~~~~~~~~')
    },
    publicKey: function (data) {
      this.tonHelp.serverPublicKey = new Uint8Array(data[0]);
      this.tonHelp.serverWalletAddr = new TonWeb.utils.Address(data[1]);
    },
    latestState: function (data)  {
      if (data === 'end') {
        data = null;
      }
      this.latestState = data;
      if (this.streamState === OwnState.PREPARING) {
        this.streamState = OwnState.STREAMING;
        this.tonTimer();
        this.$socket.emit('play', this.tonHelp.publicKey);
      }
      else if (this.streamState === OwnState.STREAMING) {
        console.log('Latest state updated while streaming ', this.latestState);
        if (this.latestState == null) {
          console.log('lets end the video');
          this.streamState = OwnState.IDLE;
          this.subEnded = true;
          this.stopTimer();
          this.$refs.videoPlayer.pause();
        }
      }
    },
    pay: async function () {
      if (this.streamState === OwnState.IDLE) {
        console.log('Pay Is Ignored !')
        return;
      }
      console.log('RECEIVED: pay')
      const res = await this.tonHelp.pay(this.latestState);
      this.$socket.emit('pay', res);
    },
    secret: function(data) {
      console.log('SECRET IS: ', data);
      this.secret = data;

      if (this.streamState == OwnState.STREAMING && this.$refs.videoPlayer.paused) {
        this.$refs.videoPlayer.src = "http://localhost:3001/getVideo?secret=" + this.secret;
        this.$refs.videoPlayer.play();
      }
    }
  },
  async mounted() {
    this.$socket.emit('publicKey')
    this.$socket.emit('latestState', this.tonHelp.publicKey)

    if (localStorage.hasOwnProperty('ton_pk')) {
      this.tonBalance = await this.tonHelp.getBalance();
      this.tonBalance = TonWeb.utils.fromNano(this.tonBalance)
    } else {
      await this.tonHelp.createSeed();
      this.showWalletAddr = true;
    }
  },
  methods: {
    calcRemainingTime() {
      this.remaningTime = this.latestState.client_balance * 100 * 30;
      console.log('Remaining Time is :::::',this.remaningTime)
      // Format To H an M an S
    },
    playStream() {
      switch (this.streamState) {
        case OwnState.IDLE:
          if (!this.latestState) {
            this.balanceAcc = true;
          } else {
            this.streamState = OwnState.STREAMING;
            this.tonTimer();
            this.$socket.emit('play', this.tonHelp.publicKey)
          }
          break
          case OwnState.STREAMING:
            this.streamState = OwnState.IDLE;
            this.stopTimer();
            this.$refs.videoPlayer.pause();
            break;

      }
    },
    async createChannel() {
      this.isLoading = true;
      this.balanceAcc = true;
      this.streamState = OwnState.PREPARING;
      const newState = await this.tonHelp.createChannel(this.amount);
      this.isLoading = false;
      this.balanceAcc = false;
      this.$socket.emit('newChannel', newState)
    },
    streamEnded() {
      console.log('Chunk ended !')
      if (this.streamState === OwnState.STREAMING) {
        this.$refs.videoPlayer.src = "http://localhost:3001/getVideo?secret=" + this.secret;
        this.$refs.videoPlayer.play();
      }
    },
    tonTimer() {
      this.tnTimer = setInterval(function() {

        // Find the distance between now and the count down date
        this.remaningTime -= 1;
        let distance = this.remaningTime;
        if (distance === 0) {
          clearInterval(this.tnTimer);
          this.timeBalance = "Subscription has ended";
          return;
        }
        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / ( 60 * 60 * 24));
        distance -= days * 60 * 60 * 24;
        let hours = Math.floor(distance / (  60 * 60));
        distance -= hours * 60 * 60;
        let minutes = Math.floor(distance /  60);
        distance -= minutes * 60;
        let seconds = Math.floor(distance);

        // Display the result in the element with id="demo"
        this.timeBalance = days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";
        // If the count down is finished, write some text
      }.bind(this), 1000);
    },
    stopTimer() {
      clearInterval(this.tnTimer);
    }
  },
  watch: {
    latestState(val, oldVal) {
      //console.log('New Latest State =======:', val);
      if (this.latestState && this.latestState.client_balance) {
        this.calcRemainingTime();
      }
      else {
        this.stopTimer();
      }
    }
  },
  components: {
    Button, Dialog, InputText
  },
}
</script>

<style scoped>
audio::-webkit-media-controls-timeline,
video::-webkit-media-controls-timeline {
  display: none;
}
audio::-webkit-media-controls,
video::-webkit-media-controls {
  display: none;
}
.app-ton-header {
  align-items: center;
  height: 100%;
}
.ton-ac-tim {
  color: #fff5f5;
  width: 30%;
  display: flex;
  justify-content: space-between;

}
.vid-container {
  width: 600px;
  height: 70%;
  margin: auto;
}
.v-pl {
  margin-top: 15px;
  border: 3px solid #181514;
  border-radius: 15px;
  height: 100%;
  width: 100%;
}
.v-b-hl {
  margin-top: 15px;
  display: flex;
  width: 100%;
  justify-content: center;
}
.btn-play-stream {
  width: 50%;
  justify-content: center;
}
.ton-tube {
  font-style: italic;
  font-size: 25px;
}
</style>

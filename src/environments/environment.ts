interface Environment {
  production: boolean;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appID: string;
  };
  firebaseConfigNueva: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBf-P5GgxS3VH5RdZ13L10bW87Tid1KFDg',
    authDomain: 'fir-test-1933d.firebaseapp.com',
    projectId: 'fir-test-1933d',
    storageBucket: 'fir-test-1933d.appspot.com',
    messagingSenderId: '224805250608',
    appID: '1:224805250608:android:23f143a41d45672dd9eff5',
  },
  firebaseConfigNueva: {
    apiKey: 'AzaSyAkXkXhwTXFT80cOnkkIHzusdAN1PBSAXA',
    authDomain: 'apicaja-4d5f1.firebaseapp.com',
    databaseURL: 'https://apicaja-4d5f1-default-rtdb.firebaseio.com/',
    projectId: 'apicaja-4d5f1',
    storageBucket: 'apicaja-4d5f1.appspot.com',
    messagingSenderId: '575058381866',
    appId: '1:575058381866:web:3c717788567987653b8753',
  },
};

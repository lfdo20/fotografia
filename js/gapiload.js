// Client ID and API key from the Developer Console
    var CLIENT_ID = 'lfdofotoapp@inductive-actor-184322.iam.gserviceaccount.com';
    // '421910158007-eu9gl3csb0taffkr8tbd64pl982glqg7.apps.googleusercontent.com';
    // lfdofotoapp@inductive-actor-184322.iam.gserviceaccount.com
    //'102819163713543806885'
    var API_KEY = 'AIzaSyBXok7QZPntOzsxhsSlQjWQ15_ip60sTOg';
    // 'AIzaSyA80wjGa_zI6ta134FRmLvS4cHUpsjgVDE';
    // 0ddaa1d63f9a5ddf313e1bc236245b2ee96e10e6
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
    var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');

    // On load, called to load the auth2 library and API client library.
    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    // Initializes the API client library and sets up sign-in state listeners.
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        console.log('Gapi Logged');
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      });
    }

    // Called when the signed in status changes, to update the UI
    // appropriately. After a sign-in, the API is called.
    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
      } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
      }
    }
    // Sign in the user upon button click.
    function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }
    // Sign out the user upon button click.
    function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

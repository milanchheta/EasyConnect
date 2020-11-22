# EasyConnect

## Folder Stucture

    .
    ├── backend/                            # Flask application files
    │   ├── app/
    │   │   ├── controllers/
    │   │   │   └── controllers.py          # File containing all the endpoints to handle frontend requests
    │   │   └── helpers/                    # Folder with helper functions
    │   │       ├── crawler.py              # File used to fetch data from google scholarly API
    │   │       ├── dbConfig.py             # Databse configuratinon file
    │   │       ├── researchersList.json    # JSON file consisting IU faculty data
    │   │       └── tokenizor.py            # File used for generating keywords and computing cosine similarities
    │   └── run.py                          # Flask application server
    ├── frontend/                           # Frontend application
    │   ├── Actions/                        # Folder containing Redux actions
    │   │   ├── LoginAction.js              # File for handling login actions
    │   │   ├── ProfileAction.js            # File for handling profile actions
    │   │   ├── RecommendationsAction.js    # File for handling recommendations actions
    │   │   └── RegisterAction.js           # File for handling registration actions
    │   ├── Reducers/                       # Folder containing Redux reducers
    │   │   ├── LoginReducer.js             # File for handling registration reducer functions
    │   │   ├── ProfileReducer.js           # File for handling registration reducer functions
    │   │   ├── RecommendationsReducer.js   # File for handling registration reducer functions
    │   │   ├── RegisterReducer.js          # File for handling registration reducer functions
    │   │   └── Rootreducer.js              # Root reducer file
    │   ├── components/                     # Folder with all the application components
    │   │   ├── BASE_URL.js                 # File with the BASE URL to send requests
    │   │   ├── Connections.js              # Component for showing connections page
    │   │   ├── EditProfile.js              # Component for editing profile page
    │   │   ├── Home.js                     # Component for showinf recommendations on homepage
    │   │   ├── Login.js                    # Component for login page
    │   │   ├── MessageRoom.js              # Component for chatroom page
    │   │   ├── PaperDetails.js             # Component for showing paper details page
    │   │   ├── PaperList.js                # Component for showing list of papers for a researcher
    │   │   ├── Profile.js                  # Component for showing researcher's profile page
    │   │   ├── Register.js                 # Component for registration page
    │   │   ├── Requests.js                 # Component for showing and handling conenction requests
    │   │   └── UserProfile.js              # Component for showing user's profile page
    │   ├── App.js                          # Entry file for react native application
    │   └── store.js                        # File containing Redux store configurations
    └── ui_Designs/                         # Folder containing inital UI designs

## How to run and test the application:

### Testing with hosted flask application:

Follow the below steps:

- Install the provided apk file `/easyconnect.apk` in an android phone.
- Good to go. Now you can start using the application.

### Testing application on local environment:

Pre-requisites:

- Expo framework kit
- Python 3.6 and higher
- `BASE_URL` in `/frontend/components/BASE_URL.js` should be `http://10.0.2.2:5000`
- Android studio with AVD for local testing

Follow the below steps:

- Execute `npm install` in `frontend/` directory.
- Execute `pip3 install -r rquirements.txt` in `backend/` directory.
- Execute `npm start` in `frontend/` directory.
- Execute `python3 run.py` in `backend/` directory.
- Start the android studio and the AVD for simulation
- Click on the `Run on Android device/simulatorr` option on local host.
- Application will start running on android simulator.

## Technical future work:

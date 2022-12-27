import {combineReducers} from 'redux';
import getCar from './Home/MyCar/reducers/myCarReducer';
import account from './Account/reducers/accountReducer';
import loading from './common/reducers/loadingReducer';
import review from './Home/Review/reducer/review'
import insurance from './Home/Insurance/reducer/insurance';
import sizeMenu from './common/reducers/sizeMenuReducer';
import news from './Home/News/reducer/news';
import followReducer from './common/reducers/followReducer'
import registration from './FirstLoginPhase/reducers/registration';
import metadata from "./common/reducers/metadata";
import answerSurvey from './Home/Score/reducer/answerSurvey';
import notification from './common/reducers/notification';
import certificationImage from'./common/reducers/CertificationImage.js';
import inspectionReducer from "./Home/Inspection/reducers/inspectionReducer";
import oilReducer from "./Home/OilChange/reducers/oilReducer";
import gasReducer from "./Home/GasStation/reducers/gasReducer";
import snsReducer from "./Home/SNS/reducer/snsReducer";

export default combineReducers({
    getCar,
    loading,
    review,
    news,
    followReducer,
    registration,
    metadata,
    profile: (state = {}) => state,
    sharing: (state = {}) => state,
    account,
    answerSurvey,
    notification,
    certificationImage,
    insurance,
    inspectionReducer,
    sizeMenu,
    gasReducer,
    oilReducer,
    snsReducer
});

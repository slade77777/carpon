import {applyMiddleware} from 'redux';
import getCar from "./Home/MyCar/middlewares/myCarMiddleware";
import accountMiddleware from "./Account/middlewares/accountMiddleware";
import reviewMiddleware from './Home/Review/middleware/reviewMiddleware';
import getMyNewsMiddleware from "./Home/News/middleware/getMyNewsMiddleware";
import followMiddleware from './common/middlewares/followMiddleware'
import {registrationMiddleware, registrationNavigatorMiddleware} from "./FirstLoginPhase/middlewares/registration";
import metadataMiddleware from "./common/middlewares/metadataMiddleware";
import answerSurveyMiddleware from "./Home/Score/middleware/answerSurvey";
import notification from './common/middlewares/notification';
import insuranceMiddleWare from "./Home/Insurance/middleware/insuranceMiddleware";
import inspectionMiddleware from "./Home/Inspection/middlewares/inspectionMiddleware";
import oilMiddleware from "./Home/OilChange/middlewares/oilMiddleware";
import gasMiddleware from "./Home/GasStation/middlewares/gasMiddleware";
import UserRankMiddleware from "./UserRankMiddleware";
import SNSMiddleware from "./Home/SNS/middleware/SNSMiddleware";

export default applyMiddleware(
    getCar,
    reviewMiddleware,
    getMyNewsMiddleware,
    followMiddleware,
    UserRankMiddleware,
    registrationMiddleware,
    registrationNavigatorMiddleware,
    metadataMiddleware,
    accountMiddleware,
    answerSurveyMiddleware,
    notification,
    insuranceMiddleWare,
    inspectionMiddleware,
    gasMiddleware,
    oilMiddleware,
    SNSMiddleware
)

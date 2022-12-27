import config from '../config';
import axios from 'axios';

import ApiSMSService from "./ApiSMSService";
import AxiosProvider from './AxiosProvider';
import NavigationService from "./NavigationService";
import ApiVerifySMS from './apiVerifyService';
import CarInformationService from "./CarInformationService";
import UserProfileService from "./UserProfileService"
import EmailConfirmationService from "./EmailConfirmationService";
import NewsService from "./NewsService";
import LoadingService from "./LoadingService";
import ReviewService from "./ReviewService"
import ListReviewService from "./ListReviewService";
import DialogService from "./DialogService";
import DeviceService from "./DeviceService";
import MyCarService from "./MyCarService";
import UploadingService from "./UploadingService";
import SurveyService from "./SurveyService";
import NotificationService from "./NotificationService";
import InsuranceService from "./InsuranceService";
import PostService from "./PostService";
import Common from "./Common";

const loadingService = new LoadingService();
const navigationService = new NavigationService();
const axiosProvider = new AxiosProvider(config, axios, navigationService);
const apiSMSService = new ApiSMSService(axiosProvider.request);
const apiVerifySMS = new ApiVerifySMS(axiosProvider.request);
const carInformationService = new CarInformationService(axiosProvider.requestWithAuth);
const userProfileService = new UserProfileService(axiosProvider.requestWithAuth);
const emailConfirmationService = new EmailConfirmationService(axiosProvider.requestWithAuth);
const newsService = new NewsService(axiosProvider.requestWithAuth);
const reviewService = new ReviewService(axiosProvider.requestWithAuth);
const listReviewService = new ListReviewService(axiosProvider.requestWithAuth);
const deviceService = new DeviceService(axiosProvider.requestWithAuth);
const dialogService = new DialogService();
const myCarService = new MyCarService(axiosProvider.requestWithAuth);
const uploadingService = new UploadingService(axiosProvider.requestWithAuth);
const surveyService = new SurveyService(axiosProvider.requestWithAuth);
const insuranceService = new InsuranceService(axiosProvider.request);
const notificationService = new NotificationService(axiosProvider.requestWithAuth);
const postService = new PostService(axiosProvider.requestWithAuth);
const commonService = new Common(axiosProvider.request);

export {
    apiSMSService,
    navigationService,
    apiVerifySMS,
    carInformationService,
    userProfileService,
    emailConfirmationService,
    newsService,
    loadingService,
    reviewService,
    listReviewService,
    dialogService,
    deviceService,
    myCarService,
    uploadingService,
    surveyService,
    notificationService,
    commonService,
    insuranceService,
    postService
}

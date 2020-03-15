export const environment = {
      production: false,
      limits: {
        maxItemsPerSubmission: 1000,
        maxSubmissionLengthInBytes: 100000,
        hashtagsPerPage: 50,
        postsPerPage: 20
      },
      endpoints : {
        socialServerUrl: "https://weibo.censorship.online/sharing",
        userSuggestionApi : " https://weibo.censorship.online/suggest",
        carrierPigeonUrl: "http://localhost:3000"
      },
      appVersion: "0.3.0"
  };
  
  
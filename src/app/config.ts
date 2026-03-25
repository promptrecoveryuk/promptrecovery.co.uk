import dotenv from 'dotenv';

function getConfig() {
  dotenv.config({ path: process.env.ENV_FILE_PATH });

  return {
    form: {
      action: 'https://api.web3forms.com/submit',
      accessKey: process.env.FORM_ACCESS_KEY || '',
    },
    socials: {
      facebookProfileId: 'promptrecovery',
      xProfileId: 'prompt_recovery',
      googleReviewsId:
        'Prompt+Recovery/@51.68032,-0.3967379,16z/data=!3m1!4b1!4m8!3m7!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D',
    },
    tracking: {
      gtmId: process.env.GOOGLE_TAG_MANAGER_ID || '',
      gaId: process.env.GOOGLE_ANALYTICS_ID || '',
    },
    isNoindex: process.env.APP_INDEX_MODE === 'NOINDEX',
  };
}

export default getConfig();

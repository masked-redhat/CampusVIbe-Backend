export const isBusinessRequest = (params) => {
  return /(true)|1/i.test(params?.business);
};

export const getUserInfo = (params) => {
  const userInfo = {};

  userInfo.first_name = getFirstName(params);
  userInfo.last_name = getLastName(params);
  userInfo.pfp = getPfp(params);
  userInfo.business_name = getBusinessName(params);
  userInfo.business_type = getBusinessType(params);
  userInfo.about = getAbout(params);
  userInfo.mission_statement = getMissionStatement(params);
  userInfo.location = getLocation(params);
  userInfo.contact_email = getContactEmail(params);
  userInfo.contact_phone = getContactPhone(params);

  return userInfo;
};

const getFirstName = (params) => params?.first_name ?? null;

const getLastName = (params) => params?.last_name ?? null;

const getPfp = (params) => params?.pfp ?? null;

const getBusinessName = (params) => params?.business_name ?? null;

const getBusinessType = (params) => params?.business_type ?? null;

const getAbout = (params) => params?.about ?? null;

const getMissionStatement = (params) => params?.mission_statement ?? null;

const getLocation = (params) => params?.location ?? null;

const getContactEmail = (params) => params?.contact_email ?? null;

const getContactPhone = (params) => params?.contact_phone ?? null;

var connectedUserId = ""


const BASE_URL = "http://41.226.11.252:11813/";

const IMAGES_URL = BASE_URL + "public/images/";

//Recipes
const RECIPES_PREFIX = "recipes/";

const RECIPES_URL = BASE_URL + RECIPES_PREFIX;

const GET_SUGGESTION_URL = RECIPES_URL + "suggestions";

const GET_FEED_URL = RECIPES_URL + "feed/";

const GET_LALEB_URL = RECIPES_URL + "label/";

const GET_ALL_LABEL_URL = RECIPES_URL + "all/";

const GET_USER_RECIPES = RECIPES_URL + "user/";

//User
const USERS_PREFIX = "users/"

const USERS_URL = BASE_URL + USERS_PREFIX;

const POST_SIGN_IN_URL = USERS_URL + "signin";
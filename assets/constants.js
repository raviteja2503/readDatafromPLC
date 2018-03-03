const CONSTANTS = {

	"DATABASE_CODES": {
		"FAIL": "Error in Database"
	},
	"REQUEST_CODES": {
		"SUCCESS": "Success",
		"FAIL": "Error in Request",
		"WARNING": "Warning..! Too Many Requests within a minute, Pleae Try After few seconds"
	},
	"TBM_CODES": {
		"FAIL": "Validation Error",
		"FIELD_VALUE_INVALID": "field {0} value is invalid",
		"REQUIRED": "field '{0}' is required.",
		"IS_NOT_MATCHED": "field '{0}' is not matched with '{1}'.",
		"NOT_A_DATE": "field {0} is incorrect UTC Date",
		"NOT_AN_EMAIL": "field '{0}' is invalid email address",
		"NOT_A_PHONE": "field {0} is invalid phone value",
		"NOT_A_MOBILE_PHONE": "{0} is not a valid mobile phone value for field {1}",
		"NOT_A_INTEGER": "{0} is not a valid integer value for field {1}",
		"NOT_A_NUMBER": "field {0} is invalid number value",
		"NOT_A_VALUE": "field {0} can't be empty.",
		"NOT_A_VALID_GENDER": "{0} is not a valid gender type.",
		"VALUE_TOO_BIG": "field {0} data is too large"
	}
};

module.exports.CONSTANTS = CONSTANTS;
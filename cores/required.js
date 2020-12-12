module.exports = {
	counselor: {
		login:{
			email:true,
			password:true,
		},
		resetpassword:{
			new_password:true,
			dial_code:true,
			phone_no:true,
		},
		forgotPassword:{
			dial_code:true,
			phone_no:true,
		},
		changepassword:{
			new_password:true,
			old_password:true,
		},
		verifyotp:{
			dial_code:true,
			phone_no:true,
			otp:true,
		},
		resendotp:{
			dial_code:true,
			contact_number:true,
		},
		register:{
			email:true,
			password:true,
			name:true,
		},
		saveQuestionnaireGeneral:{
			responses: true
		},
		saveQuestionnaireListItems:{
			questionId: true,
			responseIds: true,
		},
		cancelSub:{
			id: true
		},
		addHelp:{
			helpText: true
		},
		paymentMade:{
			success: true,
			subTypeId: true,
			paymentMethodId: true
		},
		getClient:{
			id: true
		},
		updateCounselorDetails:{
			name: true,
			email: true,
			excerpt: true,
			expTherapy: true,
			education: true,
			bankDetails: true
		},
		addBooking:{
			slotId: true,
			counselorId: true,
			bookingType: true
		},
		cancelBooking:{
			id: true,
		},
		addChatId:{
			userID: true,
		},
		getAvailability:{
			dayId: true
		},
		updateAvailability:{
			dayId: true,
			availableSlotIds: true
		}
	},

	client: {
		login:{
			email:true,
			password:true,
		},
		resetpassword:{
			new_password:true,
			dial_code:true,
			phone_no:true,
		},
		forgotPassword:{
			dial_code:true,
			phone_no:true,
		},
		changepassword:{
			new_password:true,
			old_password:true,
		},
		verifyotp:{
			dial_code:true,
			phone_no:true,
			otp:true,
		},
		resendotp:{
			dial_code:true,
			contact_number:true,
		},
		register:{
			email:true,
			password:true,
			name:true,
		},
		saveQuestionnaireGeneral:{
			responses: true
		},
		saveQuestionnaireListItems:{
			questionId: true,
			responseIds: true,
		},
		updateClientDetails:{
			name: true,
			email: true
		},
		cancelSub:{
			id: true
		},
		addHelp:{
			helpText: true
		},
		paymentMade:{
			success: true,
			subTypeId: true,
			paymentMethodId: true
		},
		addBooking:{
			slotId: true,
			counselorId: true,
			bookingType: true
		},
		cancelBooking:{
			id: true,
		},
		addChatId:{
			userID: true,
		}
	},	

	adminpanel: {
		login:{
			email:true,
			password:true,
		},
		addCounselor:{
			email:true,
			password:true,
			name:true,
		},
		addClient:{
			email:true,
			password:true,
			name:true,
		},
		updateClient:{
			name: true,
			email: true
		},
		addAssignment:{
			clientId:true,
			counselorId:true,
		},
		unmatchAssignment:{
			clientId:true,
			counselorId:true,
		},
		getClientAssignment:{
			clientId:true,
		},
	},

	help:{
		helpText: false
	}
	


}
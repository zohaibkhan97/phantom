const messages = {


    adminName:'Elevate Admin',
    restaurantName:'Fleet+ Client',
    appName:'Elevate',
    appEmail:'hi@elevateme.pk',
    appShortName:'AM',
    date_formate:'MM-DD-YYYY',
    cms_date_formate:'Do MMMM, YYYY',
    datetime_formate:'MM-DD-YYYY hh:mm A',
    datetime_formate_2:'YYYY-MM-DD HH:mm:ss',
    time_format: 'hh:mm A',
	//Auth messages

    error_user_have_not_access:'You are not permitted to do this action.',
    email_verification_pending:'Your Email ID is not verified. Please verify.',
    phone_verification_pending:'Your Phone number is not verified. Please verify.',
	account_deactivate:'Account is inactivated, please contact administrator.',
    successfully_logged_in: 'You are successfully logged in',
    forgot_password_link_sent:'Reset password link has been sent to your registered email address',
    forgot_password_sms_sent:'Please verify your contact number using OTP sent to it to reset the password',
    forgot_password_sms_resent:'OTP has been sent to your registered number',
    error_forgot_password:'Error while reset password. Please retry.',
    error_forgot_password_id_not_found:'No such user associated with this phone number',
    success_password_changed:'You have successfully reset the password Login to the app using new password.',
    error_invalid_old_password:'Invalid old password.',
    success_setting_updated:'Setting has been updated successfully.',
    verification_link_sent:'Verification link has been succesfully sent on registered email.',
    verification_pending:"Seems like you haven't verified your Email ID. Please verify your Email ID then login.",
    verification_sms_sent:'Verification code has been succesfully sent on mobile number.',
	mobile_verification_mismatch:'Entered OTP is incorrect',
    mobile_verified_successfully:'Contact number verified successfully',
    invalid_login_1:'Invalid Email ID or Password.',
    invalid_login_2:'Invalid mobile number or password',
    incorrect_old_password:'Your old password is incorrect',
    same_old_password:'Ooops your new and old password are the same',
    mobile_verified: 'Your mobile now verified',
    otp_sms_resent:'OTP has been sent to your mobile number. Please verify and reset your password.',
    otp_verified:'OTP verified successfully',
    account_deactive:'Account has been deactivated',
    account_deleted_driver:'Account deleted successfully',
    account_activate:'Account activeted successfully',
    location_not_added:'Please update your location by going to "my profile" in Fleet+ portal!',
	//Success Message
	success:'Success',
	success_notification_clear:'All Notificationa are cleared',
    success_feedback:'Thank you for feedback',
    successfully_registered:'Thank you for registering!',
    profile_update_successfully:'Profile completed successfully',
    review_list:'Review list',
    driver_assign:'Driver assigned successfully',
    delivery_completed:'Delivery completed',
    update_booking:'Booking status updated successfully',
    service_not_avilable:'Service not available in this city',
    report_not_generated:'Report not generated',

	//Error Messages
    error:'Error',
    unauthorized:'Unauthorized',
    broken_request:'Invalid Request Syntax',
	error_notification_clear:'You don\'t have any Notification',
    bad_request:'Bad request',
    error_user_not_found:'No such user found',
    user_mobile_number_exists:'Mobile number already registered',
    email_template_not_found:'Email template not found',
    mobile_verification_mismatch:'Entered OTP is incorrect',
    error_no_trip_request_found:'No such booking found',
    phone_exist_already:'Phone number already registered',
    email_exists_already:'Email already registered',
    no_such_product_found:'No such product found',
    driver_updated_successfully:'Driver updated successfully',
    driver_added_successfully:'Driver added successfully',
    driver_already_assign:'Driver already has been assigned',
    sloat_id_not_proper:'Please provide valid slot id',
    only_merchant:'Only merchant can place booking',
    no_booking:'No bookings found',
    booking_canceled:'Booking canceled',
    booking_alredy_canceled:'Already canceled',



    account_deactivate:'Your account has been deactivated. Please contact Admin for help',
    account_deleted:'Your account has been deleted',
    login_required:'Please login to add this item in your wistlist',
    login_required_for_cart:'Please login to add this item into cart',
    login_required_for_address:'Please login to add address',
    login_required_for_address_delete:'Please login to delete address',
    login_required_for_history:'Please login to clear search history',
    cart_added:'Item successfully added to cart',
    cart_updated:'Item quantity updated',
    cart_removed:'Cart item removed successfully',
    address_updated:'Address updated successfully',
    address_added:'Address added successfully',
    address_deleted:'Address deleted successfully',
    login_required_for_all:'Please login into your account',
    logout:'logout successfully',
    notification_setting:'Notification settings changed successfully',
    item_not_avail:'This item is not available right now,you can remove that item or try after some time',
	stock_not_avail:'This item stock not available right now',
    default_address_error:'This address could not found please give us other address',
    order_place:'Order place successfully',
    cart_empty:'Cart is empty',
    order_not_found:'Order not found',
    reason_not_found:'Reason not found',
    cancel_order:'Order canceled successfully',
    accept_order:'Order accept successfully',
    stock_not_avail_city:'This item not available in provided address city',
    in_valid_option:'Invalid option pass',
    request_send_to_admin:'Your request send to admin',
    //Listing Messages




    //Client Messages
    client_not_matched_with_counselor: "Either the client is not currently matched with a counselor yet or the counselor hasn't approved the match yet",
    counselor_got_booked: "The counselor is already booked at this time",
    booking_confirmed: "Booking has been confirmed!",
    client_sub_not_found: "The subscription does not exist",
    client_sub_already_cancelled: "The subscription is already cancelled",
    client_booking_not_found: "The booking does not exist",
    client_booking_already_cancelled: "The booking is already cancelled",
    client_sub_type_not_found: "The subscription type does not exist",
    payment_method_not_found: "The payment method does not exist",
    booking_type_not_found: "The given booking type does not exist",
    availability_not_found: "Availability not found for this counselor",
    day_not_found: "Day not found for this id",
    slot_not_found_for_date: "One or more of the slots are not part of the specified day",
    something_went_wrong: "Something went wrong",
    email_not_found: "Email not found",
    pair_already_matched: "Client and Counselor are already actively matched",
    already_matched: "The client is already matched with a therapist. Make sure to unmatch before matching with another therapist",
    client_not_found: "Client not found",
    counselor_not_found: "Counselor not found",
    assignment_not_found: "Client and counselor are not actively matched before",
    client_not_matched: "Client not currently matched with anyone",
	//Other Messages

    counselor_verification_pending: "Account currently under review!",
    client_verification_pending: "Email not verified yet!",
}

module.exports.messages = messages;
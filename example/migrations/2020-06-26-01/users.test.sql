SET @user_email = "test@localhost";
SET @user_password = "1234";
SET @user_secret = (SELECT SHA2(RANDOM_BYTES(256), 256));

INSERT INTO users (`email`, `secret`, `password`) VALUES
	(@user_email, @user_secret, SHA2(CONCAT(@user_password, @user_secret), 256));
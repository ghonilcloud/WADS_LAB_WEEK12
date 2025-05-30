# Viona's Todo App

## User
1. Sign up a new user with POST /service/user/signup
![](Screenshots/signup-request.png)
![](Screenshots/signup-response.png)

2. OTP sent to the user's email
![](Screenshots/email-otp.jpg)

3. Verify email with POST /service/user/verify-otp
![](Screenshots/verify-email-request.png)
![](Screenshots/verify-email-response.png)

4. Sign in with POST /service/user/signin
![](Screenshots/signin-request.png)
![](Screenshots/signin-response.png)

5. Update user details of an authenticated user with PATCH /service/user/update-user
![](Screenshots/update-user-request.png)
![](Screenshots/update-user-response.png)

6. Get user info of an authenticated user with GET /service/user/user-infor
![](Screenshots/user-info-request.png)
![](Screenshots/user-info-response.png)

7. Delete a user of an authenticated user with DELETE /service/user/delete-user
![](Screenshots/delete-user.png)

## Authorize
Authorize the account by inserting the token from the response when signing in.
![](Screenshots/authorization.png)

## Todo
1. Add a todo saved in an authenticated user’s account with POST /service/todo/add_todo
![](Screenshots/add-todo-request.png)
![](Screenshots/add-todo-response.png)

2. Update a todo saved in an authenticated user’s account with POST /service/todo/update_todo/{id}
![](Screenshots/update-todo-request.png)
![](Screenshots/update-todo-response.png)

3. Retrieve all the saved todos of an authenticated user’s with GET /service/todo/get_all
![](Screenshots/get-all-todo-request.png)
![](Screenshots/get-all-todo-response.png)

4. Delete a todo of an authenticated user with DELETE /service/todo/delete_todo/{id}
![](Screenshots/delete-todo-request.png)
![](Screenshots/delete-todo-response.png)

## Docker
Docker was setup and can be monitored in the Docker Desktop
![](Screenshots/docker.png)

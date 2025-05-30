import express from 'express';
import { signIn, signUp, userInfor, updateUser, deleteUser, logout } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User related operations
 */

/**
 * @openapi
 * /user-infor:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user information (need auth)
 *     responses:
 *       '200':
 *         description: User information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/user-infor", auth, userInfor)

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_id:
 *                 type: string
 *                 example: "BN12363468"
 *               name:
 *                 type: string
 *                 example: "juwono"
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *               address:
 *                 type: string
 *                 example: "Bandung, Indonesia"
 *               phone_number:
 *                 type: string
 *                 example: "089286382736431"
 *     responses:
 *       '200':
 *         description: New user registration successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", signUp)

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juwono@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sign In successfully!"
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     name:
 *                       type: string
 *                       example: "juwono"
 *                     email:
 *                       type: string
 *                       example: "juwono@gmail.com"
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signin", signIn)

/**
 * @openapi
 * /update-user:
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Update user details (requires authentication)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               address:
 *                 type: string
 *                 example: "Updated Address, City"
 *               phone_number:
 *                 type: string
 *                 example: "08123456789"
 *               user_image:
 *                 type: string
 *                 example: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=UpdatedAvatar"
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/update-user", auth, updateUser)

/**
 * @openapi
 * /delete-user:
 *   delete:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Delete user account (requires authentication)
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/delete-user", auth, deleteUser)

/**
 * @openapi
 * /logout:
 *   post:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Logout user (requires authentication)
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post("/logout", auth, logout)

export default router
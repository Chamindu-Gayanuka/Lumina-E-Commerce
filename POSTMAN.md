# Lumina Backend - Postman Testing Documentation

Run the guide in this order so each role has its own token and test scope:

1. `Shared / Authentication` - health check, register or use seeded accounts, then log in.

2. `Customer` - use `{{customerToken}}` for browsing, profile, cart, checkout, reviews, and customer orders.

3. `Seller` - use `{{sellerToken}}` for products, inventory, seller orders, order status, and seller profile.

4. `Administrator` - use `{{adminToken}}` for users, sellers, categories, all products, orders, inventory, and
   statistics.

5. `Authorization tests` - deliberately use the wrong role token to verify 401/403 responses.

Keep separate environment variables for `customerToken`, `sellerToken`, and `adminToken`; do not overwrite one role's
token while testing another.

## 1. Create a Postman environment

Create an environment named `Lumina Local`:

| Variable            | Initial value               |
|---------------------|-----------------------------|
| `baseUrl`           | `http://localhost:5000/api` |
| `customerToken`     | empty                       |
| `sellerToken`       | empty                       |
| `adminToken`        | empty                       |
| `customerId`        | empty                       |
| `sellerId`          | empty                       |
| `productId`         | empty                       |
| `categoryId`        | empty                       |
| `orderId`           | empty                       |
| `addressId`         | empty                       |
| `resetToken`        | empty                       |
| `verificationToken` | empty                       |

For protected requests add this header:

```http
Authorization: Bearer {{customerToken}}
```

## 2. Health check

```http
GET {{baseUrl}}/health
```

Expected:

```json
{
  "ok": true,
  "service": "lumina-backend"
}
```

## 3. Authentication Tests

### 3.1 Customer Registration

```http
POST {{baseUrl}}/auth/register
Content-Type: application/json
```

```json
{
  "name": "Postman Customer",
  "email": "postman.customer@example.com",
  "password": "Customer@12345",
  "phone": "+94771234567"
}
```

The response contains a JWT and user object. A confirmation email is sent when SMTP is configured.

### 3.2 Seller Registration

```http
POST {{baseUrl}}/auth/register-seller
Content-Type: application/json
```

```json
{
  "name": "Postman Seller",
  "email": "postman.seller@example.com",
  "password": "Seller@12345",
  "phone": "+94771234568",
  "storeName": "Postman Store",
  "businessAddress": "Colombo, Sri Lanka",
  "description": "Postman seller application"
}
```

Expected result:

```json
{
  "applicationId": "6axxxxxxxxxxxx",
  "status": "Pending"
}
```

A new seller cannot access seller routes until approved by an administrator.

### 3.3 Login

```http
POST {{baseUrl}}/auth/login
Content-Type: application/json
```

Customer body:

```json
{
  "email": "john.doe@example.com",
  "password": "Lumina@2026"
}
```

Save the response token as `customerToken`.

Run the same request for:

```json
{
  "email": "seller@lumina.lk",
  "password": "Lumina@2026"
}
```

Save the token as `sellerToken`.

Run again for:

```json
{
  "email": "admin@lumina.lk",
  "password": "Lumina@2026"
}
```

Save the token as `adminToken`.

### 3.4 Verify Email

```http
GET {{baseUrl}}/auth/verify-email?token={{verificationToken}}
```

### 3.5 Resend Verification Email

Use an authenticated user who has `emailVerified: false.`

```http
POST {{baseUrl}}/auth/resend-verification
Authorization: Bearer {{customerToken}}
```

Expected result:

```json
{
  "sent": true,
  "message": "Verification email sent"
}
```

If the account is already verified, the response will be:

```json
{
  "message": "Email is already verified"
}
```

Copy the new token from the email and save it as `verificationToken`.

### 3.6 Forgot Password

```http
POST {{baseUrl}}/auth/forgot-password
Content-Type: application/json
```

```json
{
  "email": "john.doe@example.com"
}
```

Copy the token from the email and save it as `resetToken`.

### 3.7 Reset Password

```http
POST {{baseUrl}}/auth/reset-password
Content-Type: application/json
```

```json
{
  "token": "{{resetToken}}",
  "password": "NewCustomer@12345"
}
```

### 3.8 Current Authenticated User

```http
GET {{baseUrl}}/auth/me
Authorization: Bearer {{customerToken}}
```

## 4. Customer Tests

Token: ```{{customerToken}}```

Use a Customer account for every request in this section. Seller and Administrator tokens should be rejected where the
endpoint requires the Customer role.

### 4.1 Browse Categories

```http
GET {{baseUrl}}/categories
```

### 4.2 Browse Products

```http
GET {{baseUrl}}/products?page=1&perPage=12&sort=newest
```

### 4.3 Search Products

```http
GET {{baseUrl}}/products?search=wireless
```

### 4.4 Filter Products by Category

Single category:

```http
GET {{baseUrl}}/products?category=Electronics
```

Multiple categories:

```http
GET {{baseUrl}}/products?categories=Electronics,Fashion
```

### 4.5 Filter Products by Price Range

```http
GET {{baseUrl}}/products?min=1000&max=25000
```

### 4.6 Filter by Availability

In Stock Products:

```http
GET {{baseUrl}}/products?availability=in
```

Out of Stock Products:

```http
GET {{baseUrl}}/products?availability=out
```

### 4.7 Sort Products

```http
GET {{baseUrl}}/products?sort=newest
GET {{baseUrl}}/products?sort=price-asc
GET {{baseUrl}}/products?sort=price-desc
GET {{baseUrl}}/products?sort=rating
GET {{baseUrl}}/products?sort=popular
```

### 4.8 Featured Products

```http
GET {{baseUrl}}/products?featured=true&perPage=4
```

### 4.9 Product details

First copy a product `_id` from `GET /products` into `productId`.

```http
GET {{baseUrl}}/products/{{productId}}
```

The response includes populated seller information:

```json
{
  "sellerId": {
    "name": "Demo Seller",
    "storeName": "Demo Store"
  }
}
```

### 4.10 Product reviews

List reviews:

```http
GET {{baseUrl}}/products/{{productId}}/reviews
```

Create a review:

```http
POST {{baseUrl}}/products/{{productId}}/reviews
Content-Type: application/json
```

```json
{
  "rating": 5,
  "comment": "Excellent product and fast delivery."
}
```

A customer cannot submit a duplicate review for the same product.

### 4.11 Customer profile

Update profile:

```http
PATCH {{baseUrl}}/account/profile
Content-Type: multipart/form-data
```

Form fields:

```text
name=Updated Customer
phone=+94770000000
avatar=<image file, optional>
```

Delete avatar:

```http
DELETE {{baseUrl}}/account/profile/avatar
```

### 4.12 Customer addresses

List addresses:

```http
GET {{baseUrl}}/account/addresses
```

Add address:

```http
POST {{baseUrl}}/account/addresses
Content-Type: application/json
```

```json
{
  "label": "Home",
  "fullName": "John Doe",
  "phone": "+94771234567",
  "address": "123 Main Street",
  "city": "Colombo",
  "district": "Colombo",
  "postalCode": "00300",
  "isDefault": true
}
```

Save returned address `_id` as `addressId`.

Update:

```http
PATCH {{baseUrl}}/account/addresses/{{addressId}}
Content-Type: application/json
```

```json
{
  "city": "Negombo",
  "isDefault": true
}
```

Delete:

```http
DELETE {{baseUrl}}/account/addresses/{{addressId}}
```

### 4.13 Change password

```http
POST {{baseUrl}}/account/change-password
Content-Type: application/json
```

```json
{
  "currentPassword": "Lumina@2026",
  "newPassword": "NewCustomer@12345"
}
```

### 4.14 Add item to cart

The cart is client-side state, but the product and stock are loaded from MongoDB.

Use the `_id` from the product response. Never use mock IDs such as `p1`.

Cart operations occur in the frontend. Checkout validates everything again through:

```http
POST {{baseUrl}}/orders
```

### 4.15 Checkout and create COD order

```http
POST {{baseUrl}}/orders
Content-Type: application/json
```

```json
{
  "items": [
    {
      "productId": "{{productId}}",
      "qty": 2
    }
  ],
  "deliveryAddress": {
    "fullName": "John Doe",
    "phone": "+94771234567",
    "address": "123 Main Street",
    "city": "Colombo",
    "district": "Colombo",
    "postalCode": "00300"
  },
  "deliveryFee": 450,
  "paymentMethod": "COD"
}
```

Save the returned order `_id` as `orderId`.

The API validates stock and decreases the MongoDB product stock atomically at order time.

### 4.16 Customer orders

List orders:

```http
GET {{baseUrl}}/orders/mine
```

Order details:

```http
GET {{baseUrl}}/orders/{{orderId}}
```

Cancel order:

```http
PATCH {{baseUrl}}/orders/{{orderId}}/cancel
Content-Type: application/json
```

```json
{
  "reason": "Customer changed their mind"
}
```

Cancellation is only available for `Pending` and `Processing` orders.

---

<br>

## 5. Administrator Tests

Token: `{{adminToken}}`

Use an Administrator account for every request in this section. These endpoints cover platform-wide user, seller,
catalog, order, inventory, and dashboard management.

Use:

```
Authorization: Bearer {{adminToken}}
```

### 5.1 List All Users

```http
GET {{baseUrl}}/users
```

### 5.2 Filter Users by Role

```http
GET {{baseUrl}}/users?role=Customer
GET {{baseUrl}}/users?role=Seller
GET {{baseUrl}}/users?role=Administrator
```

### 5.3 Change User Status

```http
PATCH {{baseUrl}}/users/{{customerId}}/status
Content-Type: application/json
```

```json
{
  "status": "Suspended"
}
```

Valid values:

```text
Active
Inactive
Suspended
```

### 5.4 List Sellers

```http
GET {{baseUrl}}/sellers
```

### 5.5 Seller detail:

```http
GET {{baseUrl}}/sellers/{{sellerId}}
```

### 5.6 Approve seller:

```http
PATCH {{baseUrl}}/sellers/{{sellerId}}/review
Content-Type: application/json
```

```json
{
  "approvalStatus": "Approved"
}
```

### 5.7 Reject seller:

```json
{
  "approvalStatus": "Rejected",
  "rejectionReason": "Business information is incomplete"
}
```

<br>

### 5.8 List all products:

```http
GET {{baseUrl}}/admin/products
```

### 5.9 Update product:

```http
PUT {{baseUrl}}/products/{{productId}}
Content-Type: application/json
```

### 5.10 Delete product:

```http
DELETE {{baseUrl}}/products/{{productId}}
```

<br>

### 5.11 List categories:

```http
GET {{baseUrl}}/admin/categories
```

### 5.12 Create category:

```http
POST {{baseUrl}}/categories
Content-Type: application/json
```

```json
{
  "name": "Sports",
  "description": "Sports equipment and accessories",
  "iconKey": "sports",
  "status": "Active"
}
```

### 5.13 Update category:

```http
PATCH {{baseUrl}}/categories/{{categoryId}}
Content-Type: application/json
```

```json
{
  "description": "Updated category description"
}
```

### 5.14 Delete category:

```http
DELETE {{baseUrl}}/categories/{{categoryId}}
```

<br>

### 5.15 List all orders:

```http
GET {{baseUrl}}/admin/orders
```

### 5.16 Get order details:

```http
GET {{baseUrl}}/orders/{{orderId}}
```

### 5.17 Update order status:

```http
PATCH {{baseUrl}}/orders/{{orderId}}/status
Content-Type: application/json
```

```json
{
  "status": "Shipped"
}
```

<br>

### 5.18 All inventory:

```http
GET {{baseUrl}}/inventory
```

### 5.19 Low-stock inventory:

```http
GET {{baseUrl}}/inventory?view=low
```

### 5.20 Out-of-stock inventory:

```http
GET {{baseUrl}}/inventory?view=out
```

### 5.21 Update stock:

```http
PATCH {{baseUrl}}/inventory/{{productId}}
Content-Type: application/json
```

```json
{
  "quantity": 100
}
```

### 5.22 Dashboard statistics:

```http
GET {{baseUrl}}/admin/stats
```

The response contains:

```
users
products
orders
revenue
sales order data
```

<br>

## 6. Seller Tests

**Token:** `{{sellerToken}}`

Use a Seller account for every request in this section. Product creation, updates, inventory, seller orders, and

order-status actions are seller-scoped.

Use:

```http

Authorization: Bearer {{sellerToken}}

```

### 6.1 Seller products

List seller products:

```http

GET {{baseUrl}}/products?sellerId=SELLER_OBJECT_ID&includeAll=true

```

### 6.2 Create product

```http

POST {{baseUrl}}/products

Content-Type: application/json

```

```json

{
  "name": "Postman Wireless Speaker",
  "description": "Portable Bluetooth speaker",
  "price": 12900,
  "category": "Electronics",
  "stock": 25,
  "lowStockLevel": 5,
  "status": "Active",
  "featured": false,
  "popular": true
}

```

Save the returned `_id` as `productId`.

### 6.3 Update product

```http

PUT {{baseUrl}}/products/{{productId}}

Content-Type: application/json

```

```json

{
  "price": 11900,
  "description": "Updated product description"
}

```

### 6.4 Delete product

```http

DELETE {{baseUrl}}/products/{{productId}}

```

<br>

### 6.5 List inventory:

```http

GET {{baseUrl}}/inventory

```

### 6.6 Update stock:

```http

PATCH {{baseUrl}}/inventory/{{productId}}

Content-Type: application/json

```

```json

{
  "quantity": 50
}

```

### 6.6 Seller orders

```http

GET {{baseUrl}}/seller/orders

```

### 6.7 Seller order details

```http

GET {{baseUrl}}/orders/{{orderId}}

```

### 6.8 Update order status

```http

PATCH {{baseUrl}}/orders/{{orderId}}/status

Content-Type: application/json

```

```json

{
  "status": "Processing"
}

```

Valid statuses:

```text

Pending

Processing

Shipped

Delivered

Cancelled

```

### 6.9 Seller statistics

```http

GET {{baseUrl}}/seller/stats

```

### 6.10 Seller profile

```http

PATCH {{baseUrl}}/account/profile

Content-Type: multipart/form-data

```

Fields:

```text

name

phone

avatar

```

### 6.11 Change password:

```http

POST {{baseUrl}}/account/change-password

Content-Type: application/json

```

```json

{
  "currentPassword": "Lumina@2026",
  "newPassword": "SellerNew@12345"
}

```
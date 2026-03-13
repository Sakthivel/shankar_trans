Act as:
- software architect
- database architect
- senior full stack architect
- frontend engineer
- backend engineer
- DevOps engineer

Create a scalable web application using:

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend
- Node.js
- Express.js

Database
- PostgreSQL

ORM
- Prisma

Before generating code:

1. Design the system architecture
2. Define the database schema
3. Define API endpoints
4. Define folder structure

Application features:
Home Page
-	Logo top left corner
-	Big banner image full page
-	Login button top right corner

Authentication
- Login
- Logout
- Role-based access control

Roles
- Staff
- Manager
- Owner

Manager and Owner Common Feature (the below items should support CURD operation)
-	Add Driver
-	Add vehicle number
-	Loading Plant
-	Delivery Location
-	Add Staff Role

Staff, Manager and Owner Common Feature (the below items should support CURD operation)
-	Add LPG Tanker
-	Add Contract Vehicle
-	Add Road Trip

Add LPG Tanker
-	Month (dropdown)
-	Year (dropdown)
-	Vehicle Number (dropdown, coming database)
-	Serial no
-	Date
-	Trip ID
-	Driver (dropdown, coming database)
-	Loading Plant (dropdown, coming database)
-	Delivery Location (dropdown, coming database)
-	Load Quantity per ton
-	KM
-	Fastag
-	Trip Start Date
-	Trip End Date
-	Unload quantity per ton
-	Shortage
-	Way expense 
-	Others
-	Diesel Given
-	Excess Diesel
-	Diesel amount
-	Advance 
-	Total expense
-	Rate per ton
-	Freight
-	Approval (checkbox, only visible to manager, owner role)

Add Contract Vehicle
-	Month (dropdown)
-	Year (dropdown)
-	Vehicle Number (dropdown, coming database)
-	Serial no
-	Date
-	Trip ID
-	Driver (dropdown, coming database)
-	Work place
-	Shift Day/Night (dropdown)
-	Working details
-	Start KM
-	Close KM
-	Running KM
-	Diesel
-	Mileage 
-	Diesel KM
-	Diesel Debit
-	Approval (checkbox, only visible to manager, owner role)


Add Road trip
-	Month (dropdown)
-	Year (dropdown)
-	Vehicle Number (dropdown, coming database)
-	Serial no
-	Date
-	Trip ID
-	GC NO
-	Driver (dropdown, coming database)
-	Loading Plant (dropdown, coming database)
-	Delivery Location (dropdown, coming database)
-	Quantity
-	Trip start date
-	Trip Start Time
-	Trip End date
-	Trip End time
-	Unload Quantity
-	Shortage
-	Start KM
-	Close KM
-	Running KM
-	Halting days with time
-	GC received status (dropdown, Yes/No)
-	Doc Upload
-	Remarks
-	Approval (checkbox, only visible to manager, owner role)

Dashboard feature:-
-	After login each user based on the role, they will have unique dashboard design 
-	Dashboard should have left fixed navigation bar, which is having all form access link 
-	Right side recent activity 
Reports
-	Staff, manager and owner will have report generate option
-	Reports will vehicle number wise, Driver wise, Trip Id wise, Month wise and year wise

Database Tables:
-	Users
    o	Id (auto increment, primary key) 
    o	UserId
    o	Password
    o	Name
    o	Email
    o	CreatedDate
    o	UpdatedDate
    o	Role
    o	Status (active/inactive)

-	Driver
    o	Id (auto increment, primary key) 
    o	DriverName
    o	MobileNumber
    o	CreatedDate
    o	UpdatedDate
    o	Status (active/inactive)

-	Vehicle number
    o	Id (auto increment, primary key) 
    o	VehicleNumber
    o	CreatedDate
    o	UpdatedDate
    o	Status (active/inactive)

-	Loading plant
    o	Id (auto increment, primary key) 
    o	LoadingPlant 
    o	CreatedDate
    o	UpdatedDate
    o	Status (active/inactive)

-	Delivery location
    o	Id (auto increment, primary key) 
    o	DeliveryLocation
    o	CreatedDate
    o	UpdatedDate
    o	Status (active/inactive)

-	Lap tanker
    o	Ref. from Add LPG tanker section along with createdDated, updatedDate 
-	Contract vehicle 
    o	Ref. from add Contract vehicle section along with createdDated, updatedDate
-	Road trip
    o	Ref. from add road trip section along with createdDated, updatedDate


Constraints:

- Follow clean architecture
- Use TypeScript
- Separate controller, service, and route layers
- Use reusable React components
- Proper error handling
- Use async/await

Output format:

1. Architecture overview
2. Folder structure
3. Database schema
4. Backend code
5. Frontend code
6. Deployment instructions

Ensure the application is production-ready with:

- environment variables
- validation
- proper error handling
- scalable architecture

Also generate:
-	README.md
-	Architecture.md

After generating the code, review it for scalability and security and improve it.

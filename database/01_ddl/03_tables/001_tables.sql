CREATE TABLE Person (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50),
    lastName VARCHAR(50),
    identificacionTypeId IdentificationType NOT NULL DEFAULT 'TI',
    identificationNumber VARCHAR(50),
    email VARCHAR(50),
    phone INTEGER,
    residenceAddress VARCHAR(50),
    dateBirth DATE,
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE Profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personId UUID,
    passwordHash VARCHAR(100),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_profile_person
        FOREIGN KEY (personId)
        REFERENCES Person(id)
);

CREATE TABLE Role (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(20),
    description VARCHAR(100),
    permissions VARCHAR(40),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE ProfileRole (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    roleId SMALLINT,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_profile_role_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_profile_role_role
        FOREIGN KEY (roleId)
        REFERENCES Role(id)
);

CREATE TABLE Action (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30),
    description VARCHAR(100),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE View (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30),
    description VARCHAR(100),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE Module (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30),
    description VARCHAR(100),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE RoleModule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roleId SMALLINT,
    moduleId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_role_module_role
        FOREIGN KEY (roleId)
        REFERENCES Role(id),

    CONSTRAINT fk_role_module_module
        FOREIGN KEY (moduleId)
        REFERENCES Module(id)
);

CREATE TABLE ViewModule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewId UUID,
    moduleId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_view_module_view
        FOREIGN KEY (viewId)
        REFERENCES View(id),

    CONSTRAINT fk_view_module_module
        FOREIGN KEY (moduleId)
        REFERENCES Module(id)
);

CREATE TABLE ViewAction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewId UUID,
    actionId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_view_action_view
        FOREIGN KEY (viewId)
        REFERENCES View(id),

    CONSTRAINT fk_view_action_action
        FOREIGN KEY (actionId)
        REFERENCES Action(id)
);

CREATE TABLE Family (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50),
    observations VARCHAR(100),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE FamilyMember (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    familyId UUID,
    profileId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_family_member_family
        FOREIGN KEY (familyId)
        REFERENCES Family(id),

    CONSTRAINT fk_family_member_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id)
);

CREATE TABLE City (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(40),
    country VARCHAR(30),
    status Status NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE School (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cityId SMALLINT,
    logo SMALLINT,
    name VARCHAR(30),
    address VARCHAR(30),
    phone INTEGER,
    email VARCHAR(50),
    website VARCHAR(100),
    theme VARCHAR(20),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_school_city
        FOREIGN KEY (cityId)
        REFERENCES City(id)
);

CREATE TABLE SchoolCampuse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schoolId UUID,
    name VARCHAR(30),
    address VARCHAR(30),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_school_campuse_school
        FOREIGN KEY (schoolId)
        REFERENCES School(id)
);

CREATE TABLE Course (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campusId UUID,
    name VARCHAR(10),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_course_campus
        FOREIGN KEY (campusId)
        REFERENCES SchoolCampuse(id)
);

CREATE TABLE CourseGroup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    courseId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_course_group_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_course_group_course
        FOREIGN KEY (courseId)
        REFERENCES Course(id)
);

CREATE TABLE Brand (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(30),
    status Status NOT NULL DEFAULT 'ACTIVE'
);


CREATE TABLE Year (
    id SMALLSERIAL PRIMARY KEY,
    year INTEGER,
    status Status NOT NULL DEFAULT 'ACTIVE'
);


CREATE TABLE Line (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brandId SMALLINT,
    name VARCHAR(30),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_line_brand
        FOREIGN KEY (brandId)
        REFERENCES Brand(id)
);


CREATE TABLE LineModel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lineId UUID,
    modelId SMALLINT,
    capacity SMALLINT,
    plate VARCHAR(15),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_line_model_line
        FOREIGN KEY (lineId)
        REFERENCES Line(id),

    CONSTRAINT fk_line_model_year
        FOREIGN KEY (modelId)
        REFERENCES Year(id)
);

CREATE TABLE Bus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driverId UUID,
    schoolId UUID,
    soatValidity DATE,
    gpsStatus BOOLEAN,
    lineModelId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_bus_driver
        FOREIGN KEY (driverId)
        REFERENCES Profile(id),

    CONSTRAINT fk_bus_school
        FOREIGN KEY (schoolId)
        REFERENCES School(id),

    CONSTRAINT fk_bus_line_model
        FOREIGN KEY (lineModelId)
        REFERENCES LineModel(id)
);

CREATE TABLE Stop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cityId SMALLINT,
    schoolId UUID,
    address VARCHAR(30),
    longitude DECIMAL(12,2),
    latitude DECIMAL(12,2),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_stop_city
        FOREIGN KEY (cityId)
        REFERENCES City(id),

    CONSTRAINT fk_stop_school
        FOREIGN KEY (schoolId)
        REFERENCES School(id)
);

CREATE TABLE Route (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schoolId UUID,
    name VARCHAR(30),
    targetSector VARCHAR(30),
    startDateTime TIMESTAMP,
    endDateTime TIMESTAMP,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_route_school
        FOREIGN KEY (schoolId)
        REFERENCES School(id)
);

CREATE TABLE RouteStudentAssignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    routeId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_route_student_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_route_student_route
        FOREIGN KEY (routeId)
        REFERENCES Route(id)
);

CREATE TABLE RouteStop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routeId UUID,
    stopId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_route_stop_route
        FOREIGN KEY (routeId)
        REFERENCES Route(id),

    CONSTRAINT fk_route_stop_stop
        FOREIGN KEY (stopId)
        REFERENCES Stop(id)
);

CREATE TABLE RouteBusAssignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    busId UUID,
    routeId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_route_bus_bus
        FOREIGN KEY (busId)
        REFERENCES Bus(id),

    CONSTRAINT fk_route_bus_route
        FOREIGN KEY (routeId)
        REFERENCES Route(id)
);

CREATE TABLE Boarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    busId UUID,
    stopId UUID,
    dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status Status NOT NULL DEFAULT 'ACTIVE',
    boardingTypeId BoardingType NOT NULL DEFAULT 'ON_BOARD',

    CONSTRAINT fk_boarding_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_boarding_bus
        FOREIGN KEY (busId)
        REFERENCES Bus(id),

    CONSTRAINT fk_boarding_stop
        FOREIGN KEY (stopId)
        REFERENCES Stop(id)
);

CREATE TABLE AlertType (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(30),
    description VARCHAR(100),
    urgencyLevel SMALLINT,
    status Status NOT NULL DEFAULT 'ACTIVE'
);


CREATE TABLE Alert (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alertTypeId SMALLINT,
    busId UUID,
    dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_alert_type
        FOREIGN KEY (alertTypeId)
        REFERENCES AlertType(id),

    CONSTRAINT fk_alert_bus
        FOREIGN KEY (busId)
        REFERENCES Bus(id)
);

CREATE TABLE SavedAlert (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    alertId UUID,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_saved_alert_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_saved_alert_alert
        FOREIGN KEY (alertId)
        REFERENCES Alert(id)
);

CREATE TABLE DriverLicense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID NOT NULL,
    licenseNumber SMALLINT not null,
    licenseExpirationDate DATE NOT NULL,
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_driver_license_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id)
);

CREATE TABLE ExceptionalDriverUsage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    busId UUID,
    profileId UUID,
    dateTime TIMESTAMP,
    reason VARCHAR(200),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_exception_driver_bus
        FOREIGN KEY (busId)
        REFERENCES Bus(id),

    CONSTRAINT fk_exception_driver_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id)
);

CREATE TABLE ExceptionalRouteUsage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profileId UUID,
    routeId UUID,
    startDateTime TIMESTAMP,
    endDateTime TIMESTAMP,
    reason VARCHAR(200),
    status Status NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_exception_route_profile
        FOREIGN KEY (profileId)
        REFERENCES Profile(id),

    CONSTRAINT fk_exception_route_route
        FOREIGN KEY (routeId)
        REFERENCES Route(id)
);

CREATE TABLE GpsDevice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    busId UUID,
    imei varchar(20),
    status Status NOT NULL DEFAULT 'ACTIVE',
    lastConnection TIMESTAMP,

    CONSTRAINT fk_gps_device_bus
        FOREIGN KEY (busId)
        REFERENCES Bus(id)
);

CREATE TABLE GpsLocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gpsDeviceId UUID,
    latitude decimal(10, 7),
    longitude decimal(10, 7),
    speed decimal(8, 7),
    course decimal(8, 7),
    status Status NOT NULL DEFAULT 'ACTIVE',
    dateTime TIMESTAMP,

    CONSTRAINT fk_gpsLocation_gpsDevice
        FOREIGN KEY (gpsDeviceId)
        REFERENCES GpsDevice(id)
)
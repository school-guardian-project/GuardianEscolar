using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Guid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "app");

            migrationBuilder.CreateTable(
                name: "Action",
                schema: "app",
                columns: table => new
                {
                    actionId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Action", x => x.actionId);
                });

            migrationBuilder.CreateTable(
                name: "AlertType",
                schema: "app",
                columns: table => new
                {
                    alertTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    urgencyLevel = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertType", x => x.alertTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Brand",
                schema: "app",
                columns: table => new
                {
                    brandId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brand", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "City",
                schema: "app",
                columns: table => new
                {
                    cityId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    country = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.cityId);
                });

            migrationBuilder.CreateTable(
                name: "Family",
                schema: "app",
                columns: table => new
                {
                    familyId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    observations = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Family", x => x.familyId);
                });

            migrationBuilder.CreateTable(
                name: "IdentificationType",
                schema: "app",
                columns: table => new
                {
                    identificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdentificationType", x => x.identificationId);
                });

            migrationBuilder.CreateTable(
                name: "Model",
                schema: "app",
                columns: table => new
                {
                    modelId = table.Column<Guid>(type: "uuid", nullable: false),
                    year = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Model", x => x.modelId);
                });

            migrationBuilder.CreateTable(
                name: "Module",
                schema: "app",
                columns: table => new
                {
                    moduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Module", x => x.moduleId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                schema: "app",
                columns: table => new
                {
                    roleId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    permissions = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.roleId);
                });

            migrationBuilder.CreateTable(
                name: "View",
                schema: "app",
                columns: table => new
                {
                    viewId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_View", x => x.viewId);
                });

            migrationBuilder.CreateTable(
                name: "Line",
                schema: "app",
                columns: table => new
                {
                    lineId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    brandId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Line", x => x.lineId);
                    table.ForeignKey(
                        name: "FK_Line_Brand_brandId",
                        column: x => x.brandId,
                        principalSchema: "app",
                        principalTable: "Brand",
                        principalColumn: "brandId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "School",
                schema: "app",
                columns: table => new
                {
                    schoolEntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    cityId = table.Column<Guid>(type: "uuid", nullable: false),
                    logo = table.Column<byte[]>(type: "bytea", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    phone = table.Column<int>(type: "integer", nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    website = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    theme = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School", x => x.schoolEntityId);
                    table.ForeignKey(
                        name: "FK_School_City_cityId",
                        column: x => x.cityId,
                        principalSchema: "app",
                        principalTable: "City",
                        principalColumn: "cityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                schema: "app",
                columns: table => new
                {
                    personId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    lastName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    identificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    phone = table.Column<int>(type: "integer", nullable: true),
                    residenceAddress = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.personId);
                    table.ForeignKey(
                        name: "FK_Person_IdentificationType_identificationId",
                        column: x => x.identificationId,
                        principalSchema: "app",
                        principalTable: "IdentificationType",
                        principalColumn: "identificationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleModule",
                schema: "app",
                columns: table => new
                {
                    roleModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    roleId = table.Column<Guid>(type: "uuid", nullable: false),
                    moduleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleModule", x => x.roleModuleId);
                    table.ForeignKey(
                        name: "FK_RoleModule_Module_moduleId",
                        column: x => x.moduleId,
                        principalSchema: "app",
                        principalTable: "Module",
                        principalColumn: "moduleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleModule_Role_roleId",
                        column: x => x.roleId,
                        principalSchema: "app",
                        principalTable: "Role",
                        principalColumn: "roleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViewAction",
                schema: "app",
                columns: table => new
                {
                    viewActionId = table.Column<Guid>(type: "uuid", nullable: false),
                    viewId = table.Column<Guid>(type: "uuid", nullable: false),
                    actionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViewAction", x => x.viewActionId);
                    table.ForeignKey(
                        name: "FK_ViewAction_Action_actionId",
                        column: x => x.actionId,
                        principalSchema: "app",
                        principalTable: "Action",
                        principalColumn: "actionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViewAction_View_viewId",
                        column: x => x.viewId,
                        principalSchema: "app",
                        principalTable: "View",
                        principalColumn: "viewId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViewModule",
                schema: "app",
                columns: table => new
                {
                    viewModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    viewId = table.Column<Guid>(type: "uuid", nullable: false),
                    moduleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViewModule", x => x.viewModuleId);
                    table.ForeignKey(
                        name: "FK_ViewModule_Module_moduleId",
                        column: x => x.moduleId,
                        principalSchema: "app",
                        principalTable: "Module",
                        principalColumn: "moduleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViewModule_View_viewId",
                        column: x => x.viewId,
                        principalSchema: "app",
                        principalTable: "View",
                        principalColumn: "viewId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LineModel",
                schema: "app",
                columns: table => new
                {
                    lineModelId = table.Column<Guid>(type: "uuid", nullable: false),
                    lineId = table.Column<Guid>(type: "uuid", nullable: false),
                    modelId = table.Column<Guid>(type: "uuid", nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    plate = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineModel", x => x.lineModelId);
                    table.ForeignKey(
                        name: "FK_LineModel_Line_lineId",
                        column: x => x.lineId,
                        principalSchema: "app",
                        principalTable: "Line",
                        principalColumn: "lineId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LineModel_Model_modelId",
                        column: x => x.modelId,
                        principalSchema: "app",
                        principalTable: "Model",
                        principalColumn: "modelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Route",
                schema: "app",
                columns: table => new
                {
                    routeEntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    schoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TargetSector = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Route", x => x.routeEntityId);
                    table.ForeignKey(
                        name: "FK_Route_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "schoolEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SchoolCampuse",
                schema: "app",
                columns: table => new
                {
                    schoolCampuseId = table.Column<Guid>(type: "uuid", nullable: false),
                    schoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    schoolEntityId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolCampuse", x => x.schoolCampuseId);
                    table.ForeignKey(
                        name: "FK_SchoolCampuse_School_schoolEntityId",
                        column: x => x.schoolEntityId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "schoolEntityId");
                    table.ForeignKey(
                        name: "FK_SchoolCampuse_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "schoolEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stop",
                schema: "app",
                columns: table => new
                {
                    stopId = table.Column<Guid>(type: "uuid", nullable: false),
                    cityId = table.Column<Guid>(type: "uuid", nullable: false),
                    schoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    longitude = table.Column<decimal>(type: "numeric(18,10)", precision: 18, scale: 10, nullable: false),
                    latitude = table.Column<decimal>(type: "numeric(18,10)", precision: 18, scale: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stop", x => x.stopId);
                    table.ForeignKey(
                        name: "FK_Stop_City_cityId",
                        column: x => x.cityId,
                        principalSchema: "app",
                        principalTable: "City",
                        principalColumn: "cityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stop_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "schoolEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profile",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    personId = table.Column<Guid>(type: "uuid", nullable: false),
                    password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profile", x => x.profileId);
                    table.ForeignKey(
                        name: "FK_Profile_Person_personId",
                        column: x => x.personId,
                        principalSchema: "app",
                        principalTable: "Person",
                        principalColumn: "personId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                schema: "app",
                columns: table => new
                {
                    courseId = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    campuseId = table.Column<Guid>(type: "uuid", nullable: false),
                    schoolCampuseId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.courseId);
                    table.ForeignKey(
                        name: "FK_Course_SchoolCampuse_campuseId",
                        column: x => x.campuseId,
                        principalSchema: "app",
                        principalTable: "SchoolCampuse",
                        principalColumn: "schoolCampuseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Course_SchoolCampuse_schoolCampuseId",
                        column: x => x.schoolCampuseId,
                        principalSchema: "app",
                        principalTable: "SchoolCampuse",
                        principalColumn: "schoolCampuseId");
                });

            migrationBuilder.CreateTable(
                name: "RouteStop",
                schema: "app",
                columns: table => new
                {
                    routeId = table.Column<Guid>(type: "uuid", nullable: false),
                    stopId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeStopId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteStop", x => new { x.routeId, x.stopId });
                    table.ForeignKey(
                        name: "FK_RouteStop_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "routeEntityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteStop_Stop_stopId",
                        column: x => x.stopId,
                        principalSchema: "app",
                        principalTable: "Stop",
                        principalColumn: "stopId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bus",
                schema: "app",
                columns: table => new
                {
                    busId = table.Column<Guid>(type: "uuid", nullable: false),
                    driverId = table.Column<Guid>(type: "uuid", nullable: false),
                    schoolId = table.Column<Guid>(type: "uuid", nullable: false),
                    soatValidity = table.Column<byte[]>(type: "bytea", nullable: true),
                    gpsStatus = table.Column<bool>(type: "boolean", nullable: false),
                    lineModelId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bus", x => x.busId);
                    table.ForeignKey(
                        name: "FK_Bus_LineModel_lineModelId",
                        column: x => x.lineModelId,
                        principalSchema: "app",
                        principalTable: "LineModel",
                        principalColumn: "lineModelId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bus_Profile_driverId",
                        column: x => x.driverId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bus_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "schoolEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DriverLicense",
                schema: "app",
                columns: table => new
                {
                    driverLicenseId = table.Column<Guid>(type: "uuid", nullable: false),
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    licenseNumber = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    drivingLicense = table.Column<byte[]>(type: "bytea", nullable: false),
                    licenseExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverLicense", x => x.driverLicenseId);
                    table.ForeignKey(
                        name: "FK_DriverLicense_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionalRouteUsage",
                schema: "app",
                columns: table => new
                {
                    exceptionalRouteUsageId = table.Column<Guid>(type: "uuid", nullable: false),
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeId = table.Column<Guid>(type: "uuid", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionalRouteUsage", x => x.exceptionalRouteUsageId);
                    table.ForeignKey(
                        name: "FK_ExceptionalRouteUsage_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExceptionalRouteUsage_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "routeEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyMember",
                schema: "app",
                columns: table => new
                {
                    familyMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    familyId = table.Column<Guid>(type: "uuid", nullable: false),
                    profileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyMember", x => x.familyMemberId);
                    table.ForeignKey(
                        name: "FK_FamilyMember_Family_familyId",
                        column: x => x.familyId,
                        principalSchema: "app",
                        principalTable: "Family",
                        principalColumn: "familyId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyMember_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfileRole",
                schema: "app",
                columns: table => new
                {
                    profileRoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    roleId = table.Column<Guid>(type: "uuid", nullable: false),
                    profileId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileRole", x => x.profileRoleId);
                    table.ForeignKey(
                        name: "FK_ProfileRole_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileRole_Role_roleId",
                        column: x => x.roleId,
                        principalSchema: "app",
                        principalTable: "Role",
                        principalColumn: "roleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteStudentAssignments",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeStudentAssignmentsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteStudentAssignments", x => new { x.profileId, x.routeId });
                    table.ForeignKey(
                        name: "FK_RouteStudentAssignments_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteStudentAssignments_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "routeEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseGroup",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    courseId = table.Column<Guid>(type: "uuid", nullable: false),
                    courseGroupId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseGroup", x => new { x.profileId, x.courseId });
                    table.ForeignKey(
                        name: "FK_CourseGroup_Course_courseId",
                        column: x => x.courseId,
                        principalSchema: "app",
                        principalTable: "Course",
                        principalColumn: "courseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseGroup_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alert",
                schema: "app",
                columns: table => new
                {
                    alertId = table.Column<Guid>(type: "uuid", nullable: false),
                    alertTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    busId = table.Column<Guid>(type: "uuid", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alert", x => x.alertId);
                    table.ForeignKey(
                        name: "FK_Alert_AlertType_alertTypeId",
                        column: x => x.alertTypeId,
                        principalSchema: "app",
                        principalTable: "AlertType",
                        principalColumn: "alertTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Alert_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "busId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Boarding",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    busId = table.Column<Guid>(type: "uuid", nullable: false),
                    stopId = table.Column<Guid>(type: "uuid", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    boardingId = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boarding", x => new { x.profileId, x.busId, x.stopId, x.dateTime });
                    table.ForeignKey(
                        name: "FK_Boarding_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "busId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boarding_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boarding_Stop_stopId",
                        column: x => x.stopId,
                        principalSchema: "app",
                        principalTable: "Stop",
                        principalColumn: "stopId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionalDriverUsage",
                schema: "app",
                columns: table => new
                {
                    exceptionalDriverUsageId = table.Column<Guid>(type: "uuid", nullable: false),
                    busId = table.Column<Guid>(type: "uuid", nullable: false),
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    startDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    endDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionalDriverUsage", x => x.exceptionalDriverUsageId);
                    table.ForeignKey(
                        name: "FK_ExceptionalDriverUsage_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "busId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExceptionalDriverUsage_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteBusAssignments",
                schema: "app",
                columns: table => new
                {
                    busId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeId = table.Column<Guid>(type: "uuid", nullable: false),
                    routeBusAssignmentsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteBusAssignments", x => new { x.busId, x.routeId });
                    table.ForeignKey(
                        name: "FK_RouteBusAssignments_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "busId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteBusAssignments_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "routeEntityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedAlert",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<Guid>(type: "uuid", nullable: false),
                    alertId = table.Column<Guid>(type: "uuid", nullable: false),
                    savedAlertId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedAlert", x => new { x.profileId, x.alertId });
                    table.ForeignKey(
                        name: "FK_SavedAlert_Alert_alertId",
                        column: x => x.alertId,
                        principalSchema: "app",
                        principalTable: "Alert",
                        principalColumn: "alertId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedAlert_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "profileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alert_alertTypeId",
                schema: "app",
                table: "Alert",
                column: "alertTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Alert_busId",
                schema: "app",
                table: "Alert",
                column: "busId");

            migrationBuilder.CreateIndex(
                name: "IX_Boarding_busId",
                schema: "app",
                table: "Boarding",
                column: "busId");

            migrationBuilder.CreateIndex(
                name: "IX_Boarding_stopId",
                schema: "app",
                table: "Boarding",
                column: "stopId");

            migrationBuilder.CreateIndex(
                name: "IX_Bus_driverId",
                schema: "app",
                table: "Bus",
                column: "driverId");

            migrationBuilder.CreateIndex(
                name: "IX_Bus_lineModelId",
                schema: "app",
                table: "Bus",
                column: "lineModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Bus_schoolId",
                schema: "app",
                table: "Bus",
                column: "schoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_campuseId",
                schema: "app",
                table: "Course",
                column: "campuseId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_schoolCampuseId",
                schema: "app",
                table: "Course",
                column: "schoolCampuseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseGroup_courseId",
                schema: "app",
                table: "CourseGroup",
                column: "courseId");

            migrationBuilder.CreateIndex(
                name: "IX_DriverLicense_profileId",
                schema: "app",
                table: "DriverLicense",
                column: "profileId");

            migrationBuilder.CreateIndex(
                name: "IX_ExceptionalDriverUsage_busId",
                schema: "app",
                table: "ExceptionalDriverUsage",
                column: "busId");

            migrationBuilder.CreateIndex(
                name: "IX_ExceptionalDriverUsage_profileId",
                schema: "app",
                table: "ExceptionalDriverUsage",
                column: "profileId");

            migrationBuilder.CreateIndex(
                name: "IX_ExceptionalRouteUsage_profileId",
                schema: "app",
                table: "ExceptionalRouteUsage",
                column: "profileId");

            migrationBuilder.CreateIndex(
                name: "IX_ExceptionalRouteUsage_routeId",
                schema: "app",
                table: "ExceptionalRouteUsage",
                column: "routeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMember_familyId",
                schema: "app",
                table: "FamilyMember",
                column: "familyId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMember_profileId",
                schema: "app",
                table: "FamilyMember",
                column: "profileId");

            migrationBuilder.CreateIndex(
                name: "IX_Line_brandId",
                schema: "app",
                table: "Line",
                column: "brandId");

            migrationBuilder.CreateIndex(
                name: "IX_LineModel_lineId",
                schema: "app",
                table: "LineModel",
                column: "lineId");

            migrationBuilder.CreateIndex(
                name: "IX_LineModel_modelId",
                schema: "app",
                table: "LineModel",
                column: "modelId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_identificationId",
                schema: "app",
                table: "Person",
                column: "identificationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Profile_personId",
                schema: "app",
                table: "Profile",
                column: "personId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileRole_profileId",
                schema: "app",
                table: "ProfileRole",
                column: "profileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileRole_roleId",
                schema: "app",
                table: "ProfileRole",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleModule_moduleId",
                schema: "app",
                table: "RoleModule",
                column: "moduleId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleModule_roleId",
                schema: "app",
                table: "RoleModule",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "IX_Route_schoolId",
                schema: "app",
                table: "Route",
                column: "schoolId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteBusAssignments_routeId",
                schema: "app",
                table: "RouteBusAssignments",
                column: "routeId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteStop_stopId",
                schema: "app",
                table: "RouteStop",
                column: "stopId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteStudentAssignments_routeId",
                schema: "app",
                table: "RouteStudentAssignments",
                column: "routeId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedAlert_alertId",
                schema: "app",
                table: "SavedAlert",
                column: "alertId");

            migrationBuilder.CreateIndex(
                name: "IX_School_cityId",
                schema: "app",
                table: "School",
                column: "cityId");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolCampuse_schoolEntityId",
                schema: "app",
                table: "SchoolCampuse",
                column: "schoolEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolCampuse_schoolId",
                schema: "app",
                table: "SchoolCampuse",
                column: "schoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Stop_cityId",
                schema: "app",
                table: "Stop",
                column: "cityId");

            migrationBuilder.CreateIndex(
                name: "IX_Stop_schoolId",
                schema: "app",
                table: "Stop",
                column: "schoolId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewAction_actionId",
                schema: "app",
                table: "ViewAction",
                column: "actionId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewAction_viewId",
                schema: "app",
                table: "ViewAction",
                column: "viewId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewModule_moduleId",
                schema: "app",
                table: "ViewModule",
                column: "moduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewModule_viewId",
                schema: "app",
                table: "ViewModule",
                column: "viewId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Boarding",
                schema: "app");

            migrationBuilder.DropTable(
                name: "CourseGroup",
                schema: "app");

            migrationBuilder.DropTable(
                name: "DriverLicense",
                schema: "app");

            migrationBuilder.DropTable(
                name: "ExceptionalDriverUsage",
                schema: "app");

            migrationBuilder.DropTable(
                name: "ExceptionalRouteUsage",
                schema: "app");

            migrationBuilder.DropTable(
                name: "FamilyMember",
                schema: "app");

            migrationBuilder.DropTable(
                name: "ProfileRole",
                schema: "app");

            migrationBuilder.DropTable(
                name: "RoleModule",
                schema: "app");

            migrationBuilder.DropTable(
                name: "RouteBusAssignments",
                schema: "app");

            migrationBuilder.DropTable(
                name: "RouteStop",
                schema: "app");

            migrationBuilder.DropTable(
                name: "RouteStudentAssignments",
                schema: "app");

            migrationBuilder.DropTable(
                name: "SavedAlert",
                schema: "app");

            migrationBuilder.DropTable(
                name: "ViewAction",
                schema: "app");

            migrationBuilder.DropTable(
                name: "ViewModule",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Course",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Family",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Role",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Stop",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Route",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Alert",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Action",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Module",
                schema: "app");

            migrationBuilder.DropTable(
                name: "View",
                schema: "app");

            migrationBuilder.DropTable(
                name: "SchoolCampuse",
                schema: "app");

            migrationBuilder.DropTable(
                name: "AlertType",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Bus",
                schema: "app");

            migrationBuilder.DropTable(
                name: "LineModel",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Profile",
                schema: "app");

            migrationBuilder.DropTable(
                name: "School",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Line",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Model",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Person",
                schema: "app");

            migrationBuilder.DropTable(
                name: "City",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Brand",
                schema: "app");

            migrationBuilder.DropTable(
                name: "IdentificationType",
                schema: "app");
        }
    }
}

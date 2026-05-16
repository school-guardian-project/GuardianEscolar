using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
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
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Action", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AlertType",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    urgencyLevel = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "City",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    country = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Family",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    observations = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Family", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Module",
                schema: "app",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Module", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                schema: "app",
                columns: table => new
                {
                    personId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    lastName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    identificationType = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    identificationNumber = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    phone = table.Column<int>(type: "integer", nullable: true),
                    residenceAddress = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.personId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                schema: "app",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    permissions = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "View",
                schema: "app",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_View", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "School",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cityId = table.Column<int>(type: "integer", nullable: false),
                    logo = table.Column<byte[]>(type: "bytea", nullable: true),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    phone = table.Column<int>(type: "integer", nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    website = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    theme = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School", x => x.Id);
                    table.ForeignKey(
                        name: "FK_School_City_cityId",
                        column: x => x.cityId,
                        principalSchema: "app",
                        principalTable: "City",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profile",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    personId = table.Column<int>(type: "integer", nullable: false),
                    password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profile_Person_personId",
                        column: x => x.personId,
                        principalSchema: "app",
                        principalTable: "Person",
                        principalColumn: "personId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleModule",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    roleId = table.Column<int>(type: "integer", nullable: false),
                    moduleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleModule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleModule_Module_moduleId",
                        column: x => x.moduleId,
                        principalSchema: "app",
                        principalTable: "Module",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleModule_Role_roleId",
                        column: x => x.roleId,
                        principalSchema: "app",
                        principalTable: "Role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViewAction",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    viewId = table.Column<int>(type: "integer", nullable: false),
                    actionId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViewAction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViewAction_Action_actionId",
                        column: x => x.actionId,
                        principalSchema: "app",
                        principalTable: "Action",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViewAction_View_viewId",
                        column: x => x.viewId,
                        principalSchema: "app",
                        principalTable: "View",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViewModule",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ViewId = table.Column<int>(type: "integer", nullable: false),
                    ModuleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViewModule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViewModule_Module_ModuleId",
                        column: x => x.ModuleId,
                        principalSchema: "app",
                        principalTable: "Module",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ViewModule_View_ViewId",
                        column: x => x.ViewId,
                        principalSchema: "app",
                        principalTable: "View",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Route",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    schoolId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TargetSector = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Route", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Route_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SchoolCampuse",
                schema: "app",
                columns: table => new
                {
                    campuseId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    schoolId = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SchoolEntityId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolCampuse", x => x.campuseId);
                    table.ForeignKey(
                        name: "FK_SchoolCampuse_School_SchoolEntityId",
                        column: x => x.SchoolEntityId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SchoolCampuse_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stop",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cityId = table.Column<int>(type: "integer", nullable: false),
                    schoolId = table.Column<int>(type: "integer", nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    longitude = table.Column<decimal>(type: "numeric(18,10)", precision: 18, scale: 10, nullable: false),
                    latitude = table.Column<decimal>(type: "numeric(18,10)", precision: 18, scale: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stop", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stop_City_cityId",
                        column: x => x.cityId,
                        principalSchema: "app",
                        principalTable: "City",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stop_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bus",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    driverId = table.Column<int>(type: "integer", nullable: false),
                    schoolId = table.Column<int>(type: "integer", nullable: false),
                    brand = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    soatValidity = table.Column<byte[]>(type: "bytea", nullable: true),
                    gpsStatus = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bus_Profile_driverId",
                        column: x => x.driverId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bus_School_schoolId",
                        column: x => x.schoolId,
                        principalSchema: "app",
                        principalTable: "School",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DriverLicense",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    licenseNumber = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    drivingLicense = table.Column<byte[]>(type: "bytea", nullable: false),
                    licenseExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverLicense", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DriverLicense_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyMember",
                schema: "app",
                columns: table => new
                {
                    FamilyId = table.Column<int>(type: "integer", nullable: false),
                    ProfileId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyMember", x => new { x.FamilyId, x.ProfileId });
                    table.ForeignKey(
                        name: "FK_FamilyMember_Family_FamilyId",
                        column: x => x.FamilyId,
                        principalSchema: "app",
                        principalTable: "Family",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyMember_Profile_ProfileId",
                        column: x => x.ProfileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfileRole",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    roleId = table.Column<int>(type: "integer", nullable: false),
                    profileId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileRole", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileRole_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileRole_Role_roleId",
                        column: x => x.roleId,
                        principalSchema: "app",
                        principalTable: "Role",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionalRouteUsage",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    routeId = table.Column<int>(type: "integer", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionalRouteUsage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExceptionalRouteUsage_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExceptionalRouteUsage_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteStudentAssignments",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    routeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteStudentAssignments", x => new { x.profileId, x.routeId });
                    table.ForeignKey(
                        name: "FK_RouteStudentAssignments_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteStudentAssignments_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    campuseId = table.Column<int>(type: "integer", nullable: false),
                    SchoolCampusecampuseId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Course_SchoolCampuse_SchoolCampusecampuseId",
                        column: x => x.SchoolCampusecampuseId,
                        principalSchema: "app",
                        principalTable: "SchoolCampuse",
                        principalColumn: "campuseId");
                    table.ForeignKey(
                        name: "FK_Course_SchoolCampuse_campuseId",
                        column: x => x.campuseId,
                        principalSchema: "app",
                        principalTable: "SchoolCampuse",
                        principalColumn: "campuseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteStop",
                schema: "app",
                columns: table => new
                {
                    routeId = table.Column<int>(type: "integer", nullable: false),
                    stopId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteStop", x => new { x.routeId, x.stopId });
                    table.ForeignKey(
                        name: "FK_RouteStop_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteStop_Stop_stopId",
                        column: x => x.stopId,
                        principalSchema: "app",
                        principalTable: "Stop",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alert",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    alertTypeId = table.Column<int>(type: "integer", nullable: false),
                    busId = table.Column<int>(type: "integer", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alert", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alert_AlertType_alertTypeId",
                        column: x => x.alertTypeId,
                        principalSchema: "app",
                        principalTable: "AlertType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Alert_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Boarding",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    busId = table.Column<int>(type: "integer", nullable: false),
                    stopId = table.Column<int>(type: "integer", nullable: false),
                    dateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boarding_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Boarding_Stop_stopId",
                        column: x => x.stopId,
                        principalSchema: "app",
                        principalTable: "Stop",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionalDriverUsage",
                schema: "app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    busId = table.Column<int>(type: "integer", nullable: false),
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    startDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    endDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProfileId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionalDriverUsage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExceptionalDriverUsage_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExceptionalDriverUsage_Profile_ProfileId",
                        column: x => x.ProfileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ExceptionalDriverUsage_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteBusAssignments",
                schema: "app",
                columns: table => new
                {
                    busId = table.Column<int>(type: "integer", nullable: false),
                    routeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteBusAssignments", x => new { x.busId, x.routeId });
                    table.ForeignKey(
                        name: "FK_RouteBusAssignments_Bus_busId",
                        column: x => x.busId,
                        principalSchema: "app",
                        principalTable: "Bus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteBusAssignments_Route_routeId",
                        column: x => x.routeId,
                        principalSchema: "app",
                        principalTable: "Route",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseGroup",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    courseId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseGroup", x => new { x.profileId, x.courseId });
                    table.ForeignKey(
                        name: "FK_CourseGroup_Course_courseId",
                        column: x => x.courseId,
                        principalSchema: "app",
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseGroup_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedAlert",
                schema: "app",
                columns: table => new
                {
                    profileId = table.Column<int>(type: "integer", nullable: false),
                    alertId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedAlert", x => new { x.profileId, x.alertId });
                    table.ForeignKey(
                        name: "FK_SavedAlert_Alert_alertId",
                        column: x => x.alertId,
                        principalSchema: "app",
                        principalTable: "Alert",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedAlert_Profile_profileId",
                        column: x => x.profileId,
                        principalSchema: "app",
                        principalTable: "Profile",
                        principalColumn: "Id",
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
                name: "IX_Course_SchoolCampusecampuseId",
                schema: "app",
                table: "Course",
                column: "SchoolCampusecampuseId");

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
                name: "IX_ExceptionalDriverUsage_ProfileId",
                schema: "app",
                table: "ExceptionalDriverUsage",
                column: "ProfileId");

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
                name: "IX_FamilyMember_ProfileId",
                schema: "app",
                table: "FamilyMember",
                column: "ProfileId");

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
                name: "IX_SchoolCampuse_SchoolEntityId",
                schema: "app",
                table: "SchoolCampuse",
                column: "SchoolEntityId");

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
                name: "IX_ViewModule_ModuleId",
                schema: "app",
                table: "ViewModule",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ViewModule_ViewId",
                schema: "app",
                table: "ViewModule",
                column: "ViewId");
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
                name: "Profile",
                schema: "app");

            migrationBuilder.DropTable(
                name: "School",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Person",
                schema: "app");

            migrationBuilder.DropTable(
                name: "City",
                schema: "app");
        }
    }
}

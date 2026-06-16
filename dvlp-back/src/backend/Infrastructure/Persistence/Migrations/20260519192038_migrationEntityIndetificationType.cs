using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migrationEntityIndetificationType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "identificationNumber",
                schema: "app",
                table: "Person");

            migrationBuilder.DropColumn(
                name: "identificationType",
                schema: "app",
                table: "Person");

            migrationBuilder.AddColumn<int>(
                name: "identificationId",
                schema: "app",
                table: "Person",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "IdentificationType",
                schema: "app",
                columns: table => new
                {
                    identificationId = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdentificationType", x => x.identificationId);
                    table.ForeignKey(
                        name: "FK_IdentificationType_Person_identificationId",
                        column: x => x.identificationId,
                        principalSchema: "app",
                        principalTable: "Person",
                        principalColumn: "personId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IdentificationType",
                schema: "app");

            migrationBuilder.DropColumn(
                name: "identificationId",
                schema: "app",
                table: "Person");

            migrationBuilder.AddColumn<string>(
                name: "identificationNumber",
                schema: "app",
                table: "Person",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "identificationType",
                schema: "app",
                table: "Person",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);
        }
    }
}

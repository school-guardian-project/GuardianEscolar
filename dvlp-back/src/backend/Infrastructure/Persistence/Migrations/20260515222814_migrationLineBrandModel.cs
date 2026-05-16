using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migrationLineBrandModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "brand",
                schema: "app",
                table: "Bus");

            migrationBuilder.DropColumn(
                name: "model",
                schema: "app",
                table: "Bus");

            migrationBuilder.RenameColumn(
                name: "capacity",
                schema: "app",
                table: "Bus",
                newName: "lineModelId");

            migrationBuilder.CreateTable(
                name: "Brand",
                schema: "app",
                columns: table => new
                {
                    brandId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brand", x => x.brandId);
                });

            migrationBuilder.CreateTable(
                name: "Model",
                schema: "app",
                columns: table => new
                {
                    modelId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    year = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Model", x => x.modelId);
                });

            migrationBuilder.CreateTable(
                name: "Line",
                schema: "app",
                columns: table => new
                {
                    lineId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    brandId = table.Column<int>(type: "integer", nullable: false)
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
                name: "LineModel",
                schema: "app",
                columns: table => new
                {
                    lineModelId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    lineId = table.Column<int>(type: "integer", nullable: false),
                    modelId = table.Column<int>(type: "integer", nullable: false),
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

            migrationBuilder.CreateIndex(
                name: "IX_Bus_lineModelId",
                schema: "app",
                table: "Bus",
                column: "lineModelId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Bus_LineModel_lineModelId",
                schema: "app",
                table: "Bus",
                column: "lineModelId",
                principalSchema: "app",
                principalTable: "LineModel",
                principalColumn: "lineModelId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bus_LineModel_lineModelId",
                schema: "app",
                table: "Bus");

            migrationBuilder.DropTable(
                name: "LineModel",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Line",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Model",
                schema: "app");

            migrationBuilder.DropTable(
                name: "Brand",
                schema: "app");

            migrationBuilder.DropIndex(
                name: "IX_Bus_lineModelId",
                schema: "app",
                table: "Bus");

            migrationBuilder.RenameColumn(
                name: "lineModelId",
                schema: "app",
                table: "Bus",
                newName: "capacity");

            migrationBuilder.AddColumn<string>(
                name: "brand",
                schema: "app",
                table: "Bus",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "model",
                schema: "app",
                table: "Bus",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}

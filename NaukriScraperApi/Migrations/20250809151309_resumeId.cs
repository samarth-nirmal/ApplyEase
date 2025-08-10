using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class resumeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "resumeId",
                table: "UserResumes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "resumeId",
                table: "UserResumes");
        }
    }
}

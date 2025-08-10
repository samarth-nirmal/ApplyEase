using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class resumeId1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "resumeId",
                table: "UserResumes",
                newName: "resumeTemplateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "resumeTemplateId",
                table: "UserResumes",
                newName: "resumeId");
        }
    }
}

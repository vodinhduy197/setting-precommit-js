const Configuration = {
  rules: {
    "gmo-commit-rule": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "gmo-commit-rule": ({ raw }) => {
          if (!raw) return [false, "Commit message should not be empty"];
          /**
           * Commit with format "[PRJ-123]type_commit: content"
           * Example:
           *    "[JIRA-123]feat: create login page"
           *    "[TEST-123][BUG-321]fix: fix bug 321"
           * Type Commit:
           *  ✨ feat: Adding a new feature
           *  🐛 fix: Fixing a bug
           *  💄 style: Add or update styles, ui or ux
           *  🔨 refactor: Code change that neither fixes a bug nor adds a feature
           *  📝 docs: Add or update documentation
           *  ⚡️  perf: Code change that improves performance
           *  ✅ test: Adding tests cases
           *  ⏪️ revert: Revert to a commit
           *  👷 build: Add or update regards to build process
           *  🐎 ci: Add or update regards to CI process
           */
          const regex =
            /^(\[[A-Z]+-\d+\])+(feat|fix|style|refactor|docs|revert|build|ci|perf|test):[a-zA-Z0-9\s]+/;
          const commitValid = regex.test(raw);
          if (commitValid) return [true];

          return [
            false,
            "Commit invalid rule option - Commit must match format rule [Task-ID]type:content. \n\tExample: [JIRA-123]feat: create login page",
          ];
        },
      },
    },
  ],
};
module.exports = Configuration;

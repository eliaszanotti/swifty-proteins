export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // Nouvelle fonctionnalité
				"fix", // Correction de bug
				"docs", // Documentation uniquement
				"style", // Style/formatage (pas de changement de code)
				"refactor", // Refactorisation
				"perf", // Amélioration de performance
				"test", // Ajout/modification de tests
				"chore", // Tâches de maintenance
				"ci", // CI/CD
				"revert", // Revert de commit
			],
		],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"subject-empty": [2, "never"],
		"subject-case": [0], // Pas de règle sur la casse du sujet
		"header-max-length": [2, "always", 100], // Max 100 caractères
	},
};

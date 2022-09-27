'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async transaction => {
            const transitionHost = { transaction };
            await queryInterface.addColumn(
                'courses',
                'type',
                {
                    type: Sequelize.STRING,
                },
                transitionHost,
            );
            await queryInterface.sequelize.query(
                `
                UPDATE courses
                SET type = 'DRAFT'
                WHERE type IS NULL
                `,
                transitionHost,
            );
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(transaction => {
            const transitionHost = { transaction };
            return Promise.all([queryInterface.removeColumn('courses', 'type', transitionHost)]);
        });
    },
};

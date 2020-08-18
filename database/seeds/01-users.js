const hashedPassword = "$2a$10$ZAc7lkGAHYJbH.Lu0BRxwuLtVD1Jutcdh8F/SSMz7paE4X2sfpqwG"
//pre-hashed password 'abc12345'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').insert([
    {id: 1, username: "janedoe", password: hashedPassword}, 
    {id: 2, username: "johndoe", password: hashedPassword}
  ])
};

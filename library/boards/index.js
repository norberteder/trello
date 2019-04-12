const addBoard = (name, description, teamId) => {
  if (!name || !description || !teamId)
    throw new Error(
      'Unable to create board because either a name, description or a team id was not supplied'
    );

  const request = this.constructRequest('/1/boards', 'POST', {
    name,
    desc: description,
    idOrganization: teamId,
  });
};

module.exports = { addBoard };

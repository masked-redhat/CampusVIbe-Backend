class User {
  constructor(id) {
    this.id = id;
  }

  getUserObj = () => {
    const user = {
      id: this.id,
    };

    return user;
  };
}

export default User;

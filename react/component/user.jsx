class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: null, currentUserId: currentUser.id };
  }

  componentWillMount() {
    fetch("https://my-json-server.typicode.com/sub0-l3/mock-data/users")
      .then(res => res.json())
      .then(res => {
        this.setState({ users: res });
        allUsers = res;
      });
  }

  setCurrentUser = user => {
    currentUser = user;
    this.setState({ currentUserId: user.id });
  };

  render() {
    const { users, currentUserId } = this.state;
    if (!users) {
      return null;
    }

    let usersList = users.map((user, i) => (
      <div
        className={`${user.id === currentUserId ? "user user-active" : "user"}`}
        key={i}
        onClick={() => this.setCurrentUser(user)}
      >
        <img className="user__img" src={user.avatar} />
        <div className="user_info">{`${user.first_name} ${
          user.last_name
        }`}</div>
      </div>
    ));
    return usersList;
  }
}

const domContainer = document.querySelector("#list-users");
ReactDOM.render(<User />, domContainer);

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: null };
  }

  componentWillMount() {
    fetch("https://my-json-server.typicode.com/sub0-l3/mock-data/users")
      .then(res => res.json())
      .then(res => this.setState({ users: res }));
  }
  render() {
    const { users } = this.state;
    if (!users) {
      return null;
    }

    let usersList = users.map((user,i) => (
      <div className="user" key={i}>
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

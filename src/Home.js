import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './style/custom.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      height: window.innerHeight,
      sorttype: 'price',
      page: 1,
      advertise: true,
      isLoading: false,

    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleChange = this.handleChange.bind(this);

    const columns = [{
      Header: 'Price',
      accessor: 'price' // String-based value accessors!
    }, {
      Header: 'Size',
      accessor: 'size'
      // Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      Header: 'Face',
      accessor: 'face'
    }
      //{
      //   id: 'Face', // Required because our accessor is not a string
      //   Header: 'Friend Name',
      // accessor: d => d.friend.name // Custom value accessors!
    ]
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    window.addEventListener("scroll", this.handleScroll);

    fetch("/api/products?_sort=" + this.state.sorttype + "&_page=1&_limit=15")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            isLoading: false,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({
        page: this.state.page + 1,
        isLoading: true
      })

      fetch("/api/products?_sort=" + this.state.sorttype + "&_page=" + this.state.page + "&_limit=15")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            if (!result.length) {
              alert('~ end of catalogue ~');
            } else {
              this.setState({
                isLoaded: true,
                isLoading: false,
                items: this.state.items.concat(result),
              });
            }
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
      this.setState({
        message: 'bottom reached'
      });
    } else {
      this.setState({
        message: 'not at bottom'
      });
    }

  }

  handleChange(event) {

    this.setState({
      sorttype: event.target.value,
      isLoading: true
    });
    console.log(event.target.value);

    fetch("/api/products?_sort=" + event.target.value + "&_page=" + this.state.page + "&_limit=15")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          if (!result.length) {
            alert('~ end of catalogue ~');
          } else {
            this.setState({
              isLoaded: true,
              isLoading: false,
              items: result,
            });
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )



  }

  render() {
    var fontSize = {
      fontSize: '17px'
    }

    const { error, isLoaded, items, columns, isLoading } = this.state;

    if (isLoading) {
      //return <p>Loading ...</p>;

      return <div className="loader">
        <img src="/WHda.gif" alt="Loading...." />
      </div>
    }

    return (
      <div>
        <div className="container text-center">
          <h1>Products Grid</h1>
          <div className="row">
            <div className="col-md-4">
              <label style={fontSize}>
                <input type="radio" name="sortid" id="price" value="price" onChange={this.handleChange} checked={this.state.sorttype == 'price' ? true : false} /> Sort by Price
              </label>
            </div>
            <div className="col-md-4">
              <label style={fontSize}>
                <input type="radio" name="sortid" id="size" value="size" onChange={this.handleChange} checked={this.state.sorttype == 'size' ? true : false} /> Sort by Size
              </label>
            </div>
            <div className="col-md-4">
              <label style={fontSize}>
                <input type="radio" name="sortid" id="id" value="id" onChange={this.handleChange} checked={this.state.sorttype == 'id' ? true : false} /> Sort by Id
              </label>
            </div>
          </div><br />
          {this.state.items.map(function (item, i) {
            const Facesize = {
              fontSize: item.size,
            };
            var today = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
            var expire = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(item.date))
            function parseDate(str) {
              var mdy = str.split('/');
              return new Date(mdy[2], mdy[0] - 1, mdy[1]);
            }

            function datediff(first, second) {
              var daysago = Math.round((second - first) / (1000 * 60 * 60 * 24));
              if (daysago > 7) {
                return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(item.date));
              } else {
                return daysago + " Days ago"
              }
            }

            var chk = i % 20;
            var add = false;
            if (chk == 0 && i != 0) {
              add = true;
            } else {
              add = false;
            }
            return <div>
              {add == true &&
                <header >
                  <img className="ad advertisediv" src={`/ads/?r=` + Math.floor(Math.random() * 1000)} />
                </header>
              }
              
              <div className="col-md-6" >
                <div className="infodiv">
                  <p><strong>Id:- </strong>{item.id}</p>
                  <p><strong>price:- </strong>${item.price / 100}</p>
                  <p><strong>face:- </strong><span style={Facesize}>{item.face}</span></p>
                  <p><strong>date:- </strong>{datediff(parseDate(expire), parseDate(today))}</p>
                </div>
              </div>
            </div>
          })
          }
        </div>
      </div >
    )
  }
}

export default Home;

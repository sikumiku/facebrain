import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Clarifai, { COLOR_MODEL } from 'clarifai';

const app = new Clarifai.App({
  apiKey: '5be0b22452d64cccbf003dc99976e240'
});

const particlesOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 250,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 4,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 30,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {

    const particlesInit = async (main) => {
      await loadFull(main);
    };

    return (
        <div className='App'>
            <Particles id="tsparticles" init={particlesInit}
                options={particlesOptions} className="particles" />
            <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
            { this.state.route === 'home' ?
              <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
              </div> :
              (this.state.route === 'signin' || this.state.route === 'signout') ?
                <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> :
                <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            }
        </div>
    );
  }
}

export default App;

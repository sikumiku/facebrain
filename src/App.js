import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

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

  render() {

    const particlesInit = async (main) => {
      await loadFull(main);
    };

    const particlesLoaded = (container) => {
      console.log(container);
    };

    return (
        <div className='App'>
            <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded}
                options={particlesOptions} className="particles" />
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm />
            {/* { <FaceRecognition />} */}
        </div>
    );
  }
}

export default App;

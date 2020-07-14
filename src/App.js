import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/navigation';
import SignIn from './Components/SignIn/Signin';
import Register from './Components/Register/register';
import FaceRecognition from './Components/FaceRecognition/facerecognition';
import Logo from './Components/Logo/logo';
import ImageLinkForm from './Components/ImageLinkForm/imagelinkform';
import Rank from './Components/Rank/Rank';
import './App.css';
import 'tachyons';

 // Instantiate a new Clarifai app by passing in your API key.
      const app = new Clarifai.App({apiKey: 'b347a72db90341a9a46c9f86b63a0021'});

 
  const particlesOptions = {
          particles:{ 
             number: {
                  value :300,
                  density: {
                     enable:true,
                     value_area:800 

                       }

                    }
                  }
                }
class App extends Component {
   constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn:false
    }
   }

   calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
     console.log(width, height);
     return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
     } 
   }

   displayFaceBox = (box) => {
     console.log(box);
      this.setState({box:box});
   }

   onInputChange = (event) => {
    this.setState({input:event.target.value});
   }

   onButtonSubmit = () => {
    
    this.setState({imageUrl: this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox (this.calculateFaceLocation(response)))
      .catch(err => console.log(err));

      
   }
    onRouteChange = (route) => {
      if(route === 'signout') {
         this.setState({isSignedIn:'false'})
      } else if(route === 'home') {
        this.setState({isSignedIn:'true'});
      }
      this.setState({route:route});
    }




   render() {
   const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
          <Particles className='particles'
              params={particlesOptions}

              />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
          { route === 'home' 

              ? <div>
              <Logo />
         <Rank/>
         <ImageLinkForm 
         onInputChange ={this.onInputChange} 
         onButtonSubmit ={this.onButtonSubmit} 
         />
       
       <FaceRecognition box={box} imageUrl ={imageUrl}/> 
       </div>
        : (
            route === 'signin' 
            ? <SignIn onRouteChange = {this.onRouteChange}/>
            :  <Register onRouteChange = {this.onRouteChange}/>
          )
           
              
    }
    </div>
      );
 }
}

export default App;
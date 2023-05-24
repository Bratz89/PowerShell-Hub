<a name="readme-top"></a> 
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
 
<br />
<div align="center">
  <a href="https://github.com/Bratz89/PowerShell-Hub"> 
  </a>

  <h3 align="center">PowerShell Hub</h3>

  <p align="center">
    A selfhosted hub for all you powershell scripts!
    <br />  
    <br /> 
    <a href="https://github.com/bratz89/PowerShell-Hub/issues">Report Bug</a>
    ·
    <a href="https://github.com/bratz89/PowerShell-Hub/issues">Request Feature</a>
  </p>
</div>
 
## About The Project
The PowerShell Hub is a user-friendly app that simplifies PowerShell management and code execution in a web-based interface. With this tool, you can effortlessly run PowerShell code, create scripts using built-in highlighter, and instantly view output. The app also offers parameterization for easy script customization. Plus, you can quickly download your scripts for convenient sharing and storage.  
   <br />
   <br /> 
[![PSH][product-screenshot]](https://github.com/Bratz89/PowerShell-Hub/blob/main/images/ss.png) 
  <br />
  <br />
Quickly change scripts parameters:
[![PSH][product-screenshot1]](https://github.com/Bratz89/PowerShell-Hub/blob/main/images/ss1.png) 
  <br />
  <br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>

 
### Built With
  
[React][React-url] and [Node][Node-url] 
<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
### Prerequisites
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/bratz89/PowerShell-Hub.git
   ```
2. Change folder to client
   ```sh
   cd client
   ```
3. Install NPM packages for client
   ```sh
   npm install
   ```
4. Change folder to server
   ```sh
   cd.. 
   cd server
   ```
5. Install NPM packages for server
   ```sh
   npm install
   ```
6. Start the client and server
   ```sh
   npm start
   ```
 
### Customization 
1. In the client and server .env files you can change the API key if needed
 
2. In server .env file you can change the API endpoint if you want to host a scriptserver. (Exercise caution, as scripts can be executed on the server by anyone with access. With Default settings scripts can only be run localy)
   ```sh
    REACT_APP_API_URL=http://your.ip.here:3001 / or https://yourwebsitehere.com
   ```

   Cors settings in server must be changed in app.js:
    ```sh
     const allowedOrigins = ['https://yourclientsite.com'];
    ``` 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Roadmap
- [ ] Taskmanager function
- [ ] Authentication

See the [open issues](https://github.com/bratz89/PowerShell-Hub/issues) for a full list of proposed features (and known issues). 
<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 
<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
## License 
Distributed under the MIT License.  
<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
## Contact 
Daniel Bratz - daniel.bratz@live.com  
<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
## Acknowledgments 
* [React Icons](https://react-icons.github.io/react-icons/search)
* [othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
* [concurrently](https://www.npmjs.com/package/concurrently)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
[contributors-shield]: https://img.shields.io/github/contributors/bratz89/PowerShell-Hub.svg?style=for-the-badge
[contributors-url]: https://github.com/bratz89/PowerShell-Hub/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bratz89/PowerShell-Hub.svg?style=for-the-badge
[forks-url]: https://github.com/bratz89/PowerShell-Hub/network/members
[stars-shield]: https://img.shields.io/github/stars/bratz89/PowerShell-Hub.svg?style=for-the-badge
[stars-url]: https://github.com/bratz89/PowerShell-Hub/stargazers
[issues-shield]: https://img.shields.io/github/issues/bratz89/PowerShell-Hub.svg?style=for-the-badge
[issues-url]: https://github.com/bratz89/PowerShell-Hub/issues
[license-shield]: https://img.shields.io/github/license/bratz89/PowerShell-Hub.svg?style=for-the-badge
[license-url]:  https://github.com/Bratz89/PowerShell-Hub/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/daniel-bratz-7959b722a/
[product-screenshot]:  /images/ss.png
[product-screenshot1]:  /images/ss1.png
[React-url]: https://reactjs.org/
[Node-url]: https://nodejs.org/ 

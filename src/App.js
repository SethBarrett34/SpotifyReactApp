import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { } from 'react-bootstrap';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "3c17ce18bc734b89bd2caa4b9b57b0ea";
const CLIENT_SECRET = "68a91a4502094a2d80d4a82bb135e9f0";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState("");


  useEffect(() => {
    // API Acess Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  async function search() {
    // Get request using search to get Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id });

    // Get request with Artist ID grab all the albums from that artist
    await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=US&limit=50', searchParameters) // album,sinle gets more stuff
    .then(response => response.json())
    .then(data => {
      setName(data.items[0].artists[0].name);
      setAlbums(data.items);
    });
    // Display those albums to the user 
  }

  
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl 
            placeholder="Search For Artist"
            type="input"
            onKeyDown={event => {
              if (event.key === "Enter" && event.target.value !== "") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
        <Button onClick={ event => {
            if (event.target.value !== "") {
              search();
            }
          }
        }>
          Search
        </Button>
        </InputGroup>
      </Container>
      <Container>
        <p>{(name !== "" ? "Showing results for "+ name : "")}</p>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
        {/* <p>{(name !== "" ? "People also searched for "+ name : "")}</p> */}
      </Container>
    </div>
  );
}

export default App;

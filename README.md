<h1 align="center">
  Spotify info previewer
</h1>

The original idea was to create a script that allows me to display what I'm currently playing on Spotify, just like we used to do on MSN Messenger back in the day.
This script should return an image, preferably in SVG format, with information about the track or episode I'm listening to, allowing me to embed it anywhere using the IMG element.
This allows me to include it in README files or any place where I can't load iframes or code.

You can see a demo at [this link](https://spotify-info.onrender.com/now-playing).
Since it's hosted on [Render](https://render.com/) using a free plan, you may need to refresh multiple times or wait for a while, 
as this plan terminates the process if there hasn't been recent activity.

## How to use it

First of all, you need to create an application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/create).
In the Redirect URI, I used [https://localhost:3000](https://localhost:3000), you can use the port on which you will run the application on your PC.
This is used to obtain the authorization token.

We need to obtain the `refresh_token`, which will allow us to use the API.
This token does not expire unless we revoke its access.

It's a slightly tedious process, but don't worry, you only need to do it once.

Once you've created the application, you should copy the `Client ID` and `Client Secret`, which you can obtain from the application settings.

With these two pieces of information, we'll generate a text string structured as follows: clientID:clientSecret.

We need to encode that string to base64. You can do it easily with JavaScript using the following code:

```js
const base64Code = btoa(`${clientID}:${clientSecret}`);
```

Alternatively, you can use an online [tool like this](https://www.base64encode.org/) to do the encoding.

The result should be something like this: `Y2xpZW50ZUlEOmNsaWVudFNlY3JldA==`.

Now, we need to obtain the `authorization_code`. To do this, we will access the following URL:
(Replace <CLIENT_ID> with your own data, and if you have chosen a different port for the redirect when setting up the application, you should also change the 3000)

```
https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:3000&scope=user-read-currently-playing%20
user-top-read
```
Once you access that site, it will redirect you to the Spotify's website where you should authorize the application to access your data. 
Once you accept, it will redirect you to the `redirect_uri` you have set.

In my case, it would look something like this:

```
http://localhost:3000/?code=AQBEd2PtAitaH5hnS8TimKyUZgepXpdeAY5rPI...kBtdOLhln6oM
```

That `code` parameter is the last piece we need to obtain the `refresh_token`. So, make sure to copy it.

Now, all that's left is to make the following request. Since we need to pass a header, the quickest option is to use cURL through the terminal:
(Replace base64Code and code with your own data)

```bash
curl -H "Authorization: Basic <base64Code>" -d grant_type=authorization_code -d code=<code> -d redirect_uri=http%3A%2F%2Flocalhost:3000 https://accounts.spotify.com/api/token
```
The `refresh_token` will be included in the response. Make sure to copy it, as it is the last piece we need to start using the application.
Now, clone the project and install the dependencies:

```bash
> git clone https://github.com/dallegos/spotify-info.git
> yarn install
```

Before running it, create a file named `.env` in the project's root directory.
Copy the contents of the `.env.template` file into your new file and set the constants.
Once you've done that, you can run the project:

```bash
> yarn dev
```

If everything went well, you should now be able to access the following URL: [http://localhost:3000/now-playing](http://localhost:3000/now-playing)


## Roadmap
- [x] ~~Show currently playing track/episode~~
- [ ] Show top tracks/artists
- [ ] Show public playlists

![GitHub](https://img.shields.io/github/license/dallegos/spotify-info)

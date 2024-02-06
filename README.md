# Vilnius4Kids

Explore the city with Vilnius4Kids, the must-have app for parents, caregivers, and anyone looking to make the most of outdoor playtime for kids.
Whether you're a local or just passing through, Vilnius4Kids is your go-to guide for finding, enjoying, and contributing to safe and enjoyable playground experiences.

Vilnius4Kids goes beyond being a playground locator. It's a community-driven platform that empowers users to actively contribute to the well-being of local play areas. By reporting issues and sharing experiences, you become an essential part of creating safer and more enjoyable spaces for children to play and grow.

## Key Features:

1. Find a playground: Easily locate nearby playgrounds with our user-friendly map interface. Discover hidden gems and popular play areas suitable for children of all ages.

2. Detailed Playground Profiles: Get comprehensive information on each playground, including amenities, safety features, and user reviews to ensure a delightful playtime experience.

3. Report Issues: Be a community hero! Report any issues or concerns you encounter at a playground directly through the app. From broken equipment to safety hazards, your feedback helps improve play spaces for everyone.

4. Safety Ratings: Benefit from crowd-sourced safety ratings provided by fellow users. Make informed decisions about the best and safest places for your child to play.

5. Personalized Playlists: Save and create personalized playlists of your favorite playgrounds for quick access. Plan your playdates and weekend adventures with ease.

## Application URL

To start using Vilnius4kids, visit [our page](https://vilniusforkids.mjjduaus31rmk.eu-central-1.cs.amazonlightsail.com/).

## Development

Users will find the following features available:

### Users without account

```http
GET /signup
```

Sign up for a new account.

```http
GET /login
```

Log into their account.

```http
GET /
```

See Homepage.

### Users with account

```http
GET /myHome
```

See favorite playgrounds saved.

```http
GET /playgrounds
```

See all playgrounds available.

```http
GET /playgrounds/:id
```

View a specific playground information.

```http
GET /playgrounds/:id/report
```

Make a report on a specific playground.

```http
GET /report
```

Make a new report. Playground can be chosen by the list.

```http
GET /myReports
```

View all reports for a logged-in user.

```http
GET /reports/:id
```

View a specific report for logged-in user.

## API test

If you want to explore and test our API, feel free to use the panel interface. To run it, go to [panel's url](https://vilniusforkids.mjjduaus31rmk.eu-central-1.cs.amazonlightsail.com/api/panel).
The panel will offer more possible endpoints solutions, such as performing CRUD operations on playgrounds, addresses, report categories and reports.

## Authors

- [@LucaVas](https://www.github.com/LucaVas)

## Acknowledgements

The project is created as sprint's project for Turing College, module 3, sprint 4.

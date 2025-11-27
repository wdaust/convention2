# Convention Work Organizer

A modern web application for organizing work and volunteers at Jehovah's Witnesses conventions. Built with Next.js, TypeScript, and shadcn/ui for a simple, clean, and mobile-friendly experience.

## Features

- **Departments Management**: Create and manage different work departments (Parking, First Aid, Cleaning, etc.)
- **Volunteers Management**: Keep track of all volunteers with their contact information
- **Assignments**: Assign volunteers to departments with roles, schedules, and notes
- **Dashboard**: Get an overview of all volunteers, departments, and recent assignments
- **Responsive Design**: Works seamlessly on both mobile and desktop devices
- **Simple & Clean UI**: Built with shadcn/ui for an intuitive user experience

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Prisma with SQLite (easily upgradeable to PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd convention2
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Departments

1. Navigate to the "Departments" page
2. Click "Add Department"
3. Enter the department name and optional description
4. Save the department

### Adding Volunteers

1. Navigate to the "Volunteers" page
2. Click "Add Volunteer"
3. Enter volunteer information (name, email, phone)
4. Save the volunteer

### Creating Assignments

1. Navigate to the "Assignments" page
2. Click "Create Assignment"
3. Select a volunteer and department
4. Optionally add role, start/end times, and notes
5. Save the assignment

## Database Schema

The application uses three main models:

- **Department**: Work departments with name and description
- **Volunteer**: Volunteer information including contact details
- **Assignment**: Links volunteers to departments with additional metadata

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. For production, consider upgrading to PostgreSQL

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Azure

## Development

### Project Structure

```
convention2/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── assignments/     # Assignments page
│   ├── departments/     # Departments page
│   ├── volunteers/      # Volunteers page
│   └── page.tsx         # Dashboard
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
├── prisma/             # Database schema
└── public/             # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

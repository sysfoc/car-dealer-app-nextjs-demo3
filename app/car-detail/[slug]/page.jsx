import CarDetailClient from './CarDetailClient';

async function getCarData(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cars?slug=${slug}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.cars?.find((c) => c.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const car = await getCarData(params.slug);
  
  if (!car) {
    return {
      title: 'Car Not Found',
      description: 'The requested vehicle could not be found.',
    };
  }

  const title = `${car.make} ${car.model} ${car.modelYear} for Sale${car.location ? ` in ${car.location}` : ''}`;
  
  let descriptionParts = [`${car.make} ${car.model} ${car.modelYear} model`];
  
  if (car.kms || car.mileage) {
    descriptionParts.push(`with ${car.kms || car.mileage} ${car.unit || 'km'} mileage`);
  }
  
  if (car.fuelType) {
    descriptionParts.push(`${car.fuelType} engine`);
  }
  
  if (car.features && car.features.length > 0) {
    descriptionParts.push(`and ${car.features.join(', ')}`);
  }
  
  const description = descriptionParts.join(', ') + 
    (car.location ? `. Located in ${car.location}` : '') + 
    '. Contact now to buy!';

  return {
    title,
    description,
  };
}

export default function CarDetailPage({ params }) {
  return <CarDetailClient slug={params.slug} />;
}
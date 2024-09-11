import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface NominatimResponse {
  lat: string;
  lon: string;
}

@Injectable()
export class NominatimService {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(query: string): Promise<{ lat: number; lon: number }> {
    try {
      const response: AxiosResponse<NominatimResponse[]> = await firstValueFrom(
        this.httpService.get<NominatimResponse[]>(
          `${this.nominatimUrl}?q=${encodeURIComponent(query)},Vietnam&format=json&addressdetails=1`,
        ),
      );

      const data = response.data;
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        console.log(lat);
        return { lat, lon };
      } else {
        throw new HttpException('No results found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        'Error fetching coordinates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

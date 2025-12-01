import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | undefined | null): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) return 'Justo ahora';

    const intervals: { [key: string]: number } = {
      'año': 31536000,
      'mes': 2592000,
      'semana': 604800,
      'dían': 86400,
      'hora': 3600,
      'minuto': 60,
      'segundo': 1
    };

    let counter;

    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      
      if (counter > 0) {
        if (i === 'segundo' && counter < 30) {
          return 'Justo ahora';
        }
        
        if (i === 'mes' && counter > 1) return `hace ${counter} meses`;
        if (i === 'mes' && counter === 1) return `hace 1 mes`;

        const plural = counter === 1 ? '' : 's';
        return `hace ${counter} ${i}${plural}`;
      }
    }
    
    return 'Justo ahora';
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(values: any[], searchText: string): any[] {
    if(!values) return [];
    if(!searchText) return values;
    return values.filter((value) => {
      if(searchText.length >= 2) {
        for (let i = 0; i < searchText.length; i++) {
          console.log(value.title +'  '+searchText);
  
            if ((value.title[i] != searchText[i])) {
                return false;
            }
        }
        return true;
      } else {
        return false
      }
      
  });
   }
}

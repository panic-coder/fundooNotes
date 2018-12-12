import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(values: any[], searchText: string): any[] {
    var re = new RegExp(searchText);
    if(!values) return [];
    if(!searchText) return values;
    return values.filter((value) => {
      if(searchText.length >= 2) {
        var outputTitle = (value.title).match(re)
        var outputDescription = (value.description).match(re)
        var titleFound = true;
        var descriptionFound = true;
        if(outputTitle == null) {
          titleFound = false;
        }
        if(outputDescription == null) {
          descriptionFound = false;
        }
        if(titleFound || descriptionFound){
          return true
        }
        return false;
      } else {
        return false
      }
      
  });
   }
}

export type mpaaRating ="G" | "PG" | "PG-13" | "R" | "RY"
export type ageRating ="All" | "7+" | "13+" | "16+" | "18+"

export function mpaaToAgeGroup(input:string|mpaaRating):ageRating|undefined {
  switch ( input.toUpperCase() ) {
    case "G": return "All"
    case "PG": return "7+"
    case "PG-13": return "13+"
    case "R":
    case "R+": return "16+"
    case "NC-17":
    case "RY": return "18+"
  }
}
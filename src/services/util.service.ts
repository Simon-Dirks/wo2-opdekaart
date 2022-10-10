export class UtilService {
  public static labelMatchesSearch(
    label: string | undefined,
    search: string,
    searchIsLowered = false
  ) {
    if (!search || !label) {
      return true;
    }

    if (searchIsLowered) {
      return label.toLowerCase().includes(search);
    }

    return label.toLowerCase().includes(search.toLowerCase());
  }
}

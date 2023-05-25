
import React from "react";

export function useMemoSortedCollection(collections) {
  const result = React.useMemo(() => {
    const colls = collections;

    if(!colls) {
      return colls;
    }

    const result = [...colls];
    result.sort((a, b) => {
      if(a.children && b.children) {
        return a.name.localeCompare(b.name);
      } else if(a.children) {
        return -1;
      } else if(b.children) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [collections]);

  return result;
}
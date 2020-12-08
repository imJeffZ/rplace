#include <stdio.h>
#include <string.h>
#include <stdlib.h>

__device__ __host__ int bruteIncrement(char* brute, int alphabetLen, int wordLen, int incrementBy) {
	int i = 0;
	while(incrementBy > 0 && i < wordLen) {
		int add = incrementBy + brute[i];
		brute[i] = (char)(add % alphabetLen);
		incrementBy = add / alphabetLen;
		i++;
	}
	return incrementBy == 0; 
}

__device__ void bruteToString(char *brute, int wordLen, char *alphabet, char *out){
	for(int i=0;i<wordLen;i++){
		out[i]=alphabet[brute[i]];
	}
	out[wordLen]='\0';
}

__device__ int any(char *list, int listSize){
	for(int i=0;i<listSize;i++){
		if(list[i])return 1;
	}
	return 0;
}

void printWork(char *work, int workLen){
	char *out[] = { "false", "true" };
	for(int i=0;i<workLen;i++){
		printf("%s ", out[work[i]]);
	}
	printf("\n");
}


__device__ int my_strcmp(char a[], char b[])
{
   int c = 0;

   while (a[c] == b[c]) {
      if (a[c] == '\0' || b[c] == '\0')
         break;
      c++;
   }

   if (a[c] == '\0' && b[c] == '\0')
      return 0;
   else
      return -1;
}
__device__ int searchPart(char *targetString, char *alphabet, char *brute, int workSize, int workerId, int wordLen, int alphabetLen){
	// Go to the start of my work
	if(!bruteIncrement(brute, alphabetLen, wordLen, workSize*workerId)){
        	return 0;
        }
        int count = 0;
	char *out = new char[wordLen + 1];
        while(1){
		if(count>=workSize)break;
		bruteToString(brute, wordLen, alphabet, out);
		if(my_strcmp(out, targetString)==0)return 1;
		count +=1;
		if(!bruteIncrement(brute, alphabetLen, wordLen, 1))break;
        }
        return 0;
}

__global__ void search(int *foundWord, char *targetString, char *alphabet, int wordLen, int alphabetLen){
	long wordId = threadIdx.x + (blockIdx.x * blockDim.x);
	char *brute = new char[wordLen]; 
	for(int i=0;i<wordLen;i++)brute[i]=0;
	
	char *brutePart = new char[wordLen]; // Really probably need another brutePart for each worker
	for(int i=0;i<wordLen;i++)brutePart[i]=brute[i];
	int success = searchPart(targetString, alphabet, brutePart, 1024, wordId, wordLen, alphabetLen);
	if (success == 1){
		*foundWord = 1;
	}
	return;
}


int main( int argc, char** argv) {
	char *targetString = argv[1];
	char *alphabet = argv[2];

	int wordLen = strlen(targetString);
	int alphabetLen = strlen(alphabet);


	
	
	char *targetString_device;
	char *alphabet_device;
	int *foundWord_device = 0;

	cudaMallocManaged(&foundWord_device, sizeof(int));
	cudaMalloc((void **)&targetString_device, wordLen*sizeof(char));
	cudaMalloc((void **)&alphabet_device, alphabetLen*sizeof(char));


	cudaMemcpy(targetString_device, targetString, wordLen*sizeof(char), cudaMemcpyHostToDevice);
	cudaMemcpy(alphabet_device, alphabet, alphabetLen*sizeof(char), cudaMemcpyHostToDevice);

	search<<<1024, 1024>>>(foundWord_device, targetString_device, alphabet_device, wordLen, alphabetLen);
	cudaDeviceSynchronize();
	
	if(*foundWord_device == 1){
		printf("found\n");
	} else {
		printf("not found\n");
	}
	cudaFree(foundWord_device);
	cudaFree(targetString_device);
	cudaFree(alphabet_device);
	
}


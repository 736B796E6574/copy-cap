def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

def calculate_product(numbers):
    result = 1
    for num in numbers:
        result *= num
    return result

def main():
    data = [2, 3, 4, 5]
    print("Sum:", calculate_sum(data))
    print("Product:", calculate_product(data))

if __name__ == "__main__":
    main()
